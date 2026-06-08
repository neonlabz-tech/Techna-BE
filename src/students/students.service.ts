import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';
import { Model, Types } from 'mongoose';
import { randomUUID } from 'node:crypto';
import * as QRCode from 'qrcode';

import { EmailService } from '../email/email.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { EnrolmentHistoryDto } from './dto/enrolment-history.dto';
import { RegisterStudentDto } from './dto/register-student.dto';
import { RejectStudentDto } from './dto/reject-student.dto';
import { Counter, CounterDocument } from './schemas/counter.schema';
import { Student, StudentDocument } from './schemas/student.schema';

export type CreateStudentPayload = CreateStudentDto & {
  password?: string;
  studentId?: string;
  qrToken?: string;
  enrolledAt?: string;
  status?: 'pending' | 'approved' | 'rejected';
};

export type UpdateStudentPayload = Partial<CreateStudentPayload>;

@Injectable()
export class StudentsService {
  constructor(
    @InjectModel(Student.name)
    private readonly studentModel: Model<StudentDocument>,

    @InjectModel(Counter.name)
    private readonly counterModel: Model<CounterDocument>,

    private readonly emailService: EmailService,
  ) {}

  // ─────────────────────────────────────────────────────────────────────────
  // FIND ALL  (Admin: see all students with optional status filter)
  // ─────────────────────────────────────────────────────────────────────────
  async findAll(status?: 'pending' | 'approved' | 'rejected') {
    const filter = status ? { status } : {};
    return this.studentModel.find(filter).select('-password').lean();
  }

  // ─────────────────────────────────────────────────────────────────────────
  // FIND ONE  (Admin or own student)
  // ─────────────────────────────────────────────────────────────────────────
  async findOne(id: string) {
    const student = await this.studentModel
      .findById(id)
      .select('-password')
      .lean();

    if (!student) throw new NotFoundException('Student not found');

    return student;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // PUBLIC REGISTRATION  (POST /students/register — no auth required)
  // ─────────────────────────────────────────────────────────────────────────
  async registerStudent(dto: RegisterStudentDto) {
    if (!dto.subjectSelection.agreed) {
      throw new BadRequestException(
        'You must agree to the terms before submitting the registration',
      );
    }

    const dateOfBirth = this.resolveDateOfBirth(dto.personal);

    const email = dto.account.email.trim().toLowerCase();

    const existingEmail = await this.studentModel.findOne({ email }).lean();
    if (existingEmail) {
      throw new ConflictException(
        'An account with this email address already exists',
      );
    }

    if (dto.personal.nicNo) {
      const existingNic = await this.studentModel
        .findOne({ nicNo: dto.personal.nicNo.trim() })
        .lean();
      if (existingNic) {
        throw new ConflictException(
          'An application with this NIC number already exists',
        );
      }
    }

    const year = new Date().getFullYear();
    const [
      studentId,
      admissionNumber,
      serialNumber,
      applicationReference,
    ] = await Promise.all([
      this.generateStudentId(),
      this.generateReference('admissionNumber', 'ADM', year),
      this.generateReference('serialNumber', 'SN', year),
      this.generateReference('applicationReference', 'APP', year),
    ]);

    const qrToken = randomUUID();
    const hashedPassword = await bcrypt.hash(dto.account.password, 10);

    const payload = {
      studentId,
      qrToken,
      status: 'pending' as const,
      enrolledAt: new Date().toISOString(),

      admissionNumber,
      serialNumber,
      applicationReference,

      email,
      password: hashedPassword,

      fullNameTamil:          dto.personal.fullNameTamil?.trim(),
      fullNameEnglish:        dto.personal.fullNameEnglish.trim().toUpperCase(),
      dateOfBirth,
      nicNo:                  dto.personal.nicNo.trim(),
      school:                 dto.personal.school?.trim(),
      whatsappNo:             dto.personal.whatsappNo.trim(),
      phone:                  dto.personal.whatsappNo.trim(),
      parentsNo:              dto.personal.parentsNo?.trim(),
      permanentAddress:       dto.personal.permanentAddress.trim(),
      administrativeDistrict: dto.personal.administrativeDistrict,
      fixedTelephone:         dto.personal.fixedTelephone?.trim(),
      residingSince:          dto.personal.residingSince?.trim(),
      race:                   dto.personal.race,
      religion:               dto.personal.religion,
      citizenByDescent:       dto.personal.citizenByDescent ?? 'YES',
      contactAddress:         dto.personal.contactAddress?.trim(),
      postalCode:             dto.personal.postalCode?.trim(),

      fatherName:       dto.parent?.fatherName?.trim().toUpperCase(),
      motherName:       dto.parent?.motherName?.trim().toUpperCase(),
      guardianName:     dto.parent?.guardianName?.trim().toUpperCase(),
      contactPerson:    dto.parent?.contactPerson ?? 'Mother',
      guardianAddress:  dto.parent?.guardianAddress?.trim(),
      guardianFixedTel: dto.parent?.guardianFixedTel?.trim(),
      guardianMobile:   dto.parent?.guardianMobile?.trim(),

      olCategory:    dto.olRecords?.olCategory   ?? 'Local O/L',
      olYear:        dto.olRecords?.olYear?.trim(),
      olIndexNumber: dto.olRecords?.olIndexNumber?.trim(),
      olNameUsed:    dto.olRecords?.olNameUsed?.trim().toUpperCase(),
      olAccept:      dto.olRecords?.olAccept      ?? 'Accept',
      olResults:     dto.olRecords?.olResults     ?? [],

      subjects: dto.subjectSelection.subjects,
      agreed:   dto.subjectSelection.agreed,

      batch:   dto.batch?.trim() ?? 'N/A',
      modules: dto.subjectSelection.subjects,
    };

    try {
      const student = await this.studentModel.create(payload);

      void this.emailService.sendRegistrationEmail({
        email:     student.email,
        name:      student.fullNameEnglish ?? student.email,
        studentId: student.studentId,
      });

      return {
        message: 'Registration submitted successfully. Awaiting admin approval.',
        data: {
          _id:                  student._id,
          studentId:            student.studentId,
          admissionNumber:      student.admissionNumber,
          serialNumber:         student.serialNumber,
          applicationReference: student.applicationReference,
          fullNameEnglish:      student.fullNameEnglish,
          email:                student.email,
          status:               student.status,
          enrolledAt:           student.enrolledAt,
        },
      };
    } catch (error) {
      if (this.isDuplicateKeyError(error)) {
        throw new ConflictException(
          'A duplicate entry was detected — email or NIC already exists',
        );
      }
      throw error;
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // ADMIN CREATE  (POST /students — Admin only, full payload)
  // ─────────────────────────────────────────────────────────────────────────
  async create(data: CreateStudentPayload) {
    this.validateRegistration(data);

    const payload: CreateStudentPayload = {
      ...data,
      email:     data.email.trim().toLowerCase(),
      modules:   data.modules ?? [],
      studentId: data.studentId?.trim() || (await this.generateStudentId()),
      qrToken:   data.qrToken?.trim()   || randomUUID(),
      status:    data.status             ?? 'pending',
      enrolledAt: data.enrolledAt        ?? new Date().toISOString(),
    };

    if (payload.password) {
      payload.password = await bcrypt.hash(payload.password, 10);
    }

    try {
      const student = await this.studentModel.create(payload);

      // FIX: was student.name — field does not exist on schema
      void this.emailService.sendRegistrationEmail({
        email:     student.email,
        name:      student.fullNameEnglish ?? student.email,
        studentId: student.studentId,
      });

      const result = student.toObject() as { password?: string };
      delete result.password;

      return result;
    } catch (error) {
      if (this.isDuplicateKeyError(error)) {
        throw new ConflictException('Student email or ID already exists');
      }
      throw error;
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // UPDATE  (Admin only)
  // ─────────────────────────────────────────────────────────────────────────
  async update(id: string, data: UpdateStudentPayload) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    const student = await this.studentModel
      .findByIdAndUpdate(id, data, { new: true, runValidators: true })
      .select('-password')
      .lean();

    if (!student) throw new NotFoundException('Student not found');

    return student;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // DELETE  (Admin only)
  // ─────────────────────────────────────────────────────────────────────────
  async remove(id: string) {
    const student = await this.studentModel.findByIdAndDelete(id).lean();

    if (!student) throw new NotFoundException('Student not found');

    return { message: 'Student deleted successfully' };
  }

  // ─────────────────────────────────────────────────────────────────────────
  // APPROVE  (Admin only)
  // ─────────────────────────────────────────────────────────────────────────
  async approveStudent(id: string): Promise<Student> {
    const student = await this.findStudentByIdOrStudentId(id);

    if (student.status !== 'approved') {
      student.status = 'approved';
      student.approvedAt = new Date().toISOString();
      student.rejectionReason = undefined;
      await student.save();
    }

    return this.generateStudentQrCode(student.studentId);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // REJECT  (Admin only)
  // ─────────────────────────────────────────────────────────────────────────
  async rejectStudent(id: string, dto: RejectStudentDto): Promise<object> {
    const student = await this.findStudentByIdOrStudentId(id);
    const shouldSendEmail = student.status !== 'rejected';

    student.status = 'rejected';
    student.rejectionReason = dto.reason.trim();
    await student.save();

    if (shouldSendEmail) {
      // FIX: was student.fullNameEnglish ?? student.name ?? student.email
      void this.emailService.sendRejectionEmail({
        email:     student.email,
        name:      student.fullNameEnglish ?? student.email,
        studentId: student.studentId,
        reason:    dto.reason.trim(),
      });
    }

    return {
      message: 'Student registration rejected.',
      data: {
        _id:             student._id,
        studentId:       student.studentId,
        status:          student.status,
        rejectionReason: student.rejectionReason,
      },
    };
  }

  // ─────────────────────────────────────────────────────────────────────────
  // ENROLMENT HISTORY  (Admin or own student)
  // ─────────────────────────────────────────────────────────────────────────
  async getEnrolmentHistory(
    targetId: string,
    requesterId: string,
    requesterRole: string,
  ): Promise<EnrolmentHistoryDto> {
    if (requesterRole === 'student' && requesterId !== targetId) {
      throw new ForbiddenException(
        'You can only view your own enrolment history',
      );
    }

    const student = await this.studentModel
      .findById(targetId)
      .select('-password -qrCode -qrToken')
      .lean();

    if (!student) throw new NotFoundException('Student not found');

    // FIX: was student.fullNameEnglish ?? student.name ?? ''
    const history: EnrolmentHistoryDto = {
      studentId:       (student._id as Types.ObjectId).toString(),
      studentCode:     student.studentId,
      name:            student.fullNameEnglish ?? '',
      email:           student.email,
      phone:           student.phone ?? student.whatsappNo ?? '',
      modules:         student.modules ?? [],
      batch:           student.batch ?? '',
      status:          student.status,
      enrolledAt:      student.enrolledAt,
      approvedAt:      student.approvedAt ?? null,
      rejectionReason: student.rejectionReason,
    };

    return history;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // GENERATE QR CODE
  // ─────────────────────────────────────────────────────────────────────────
  async generateStudentQrCode(studentId: string): Promise<Student> {
    if (!studentId?.trim()) {
      throw new BadRequestException('studentId is required');
    }

    const student = await this.studentModel.findOne({ studentId }).exec();

    if (!student) throw new NotFoundException('Student not found');

    if (student.status !== 'approved') {
      throw new BadRequestException(
        'QR code can only be generated for approved students',
      );
    }

    if (student.qrCode) return student;

    // FIX: was student.fullNameEnglish ?? student.name
    const qrPayload = {
      studentId:   student.studentId,
      fullName:    student.fullNameEnglish ?? '',
      email:       student.email,
      admissionNo: student.admissionNumber,
    };

    let qrCode: string;

    try {
      qrCode = await QRCode.toDataURL(JSON.stringify(qrPayload), {
        errorCorrectionLevel: 'M',
        margin: 1,
        type: 'image/png',
        width: 300,
      });
    } catch {
      throw new InternalServerErrorException('Failed to generate QR code');
    }

    const updated = await this.studentModel
      .findByIdAndUpdate(student._id, { $set: { qrCode } }, { new: true })
      .select('-password');

    return updated ?? student;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // HELPERS
  // ─────────────────────────────────────────────────────────────────────────

  private resolveDateOfBirth(
    personal: RegisterStudentDto['personal'],
  ): Date {
    if (personal.dateOfBirth) {
      const d = new Date(personal.dateOfBirth);
      if (isNaN(d.getTime())) {
        throw new BadRequestException('Invalid dateOfBirth value');
      }
      return d;
    }

    if (personal.dobDay && personal.dobMonth && personal.dobYear) {
      const { dobDay, dobMonth, dobYear } = personal as {
        dobDay: number;
        dobMonth: number;
        dobYear: number;
      };
      const d = new Date(dobYear, dobMonth - 1, dobDay);
      if (isNaN(d.getTime())) {
        throw new BadRequestException(
          'Invalid date of birth — check dobDay, dobMonth, dobYear values',
        );
      }
      return d;
    }

    throw new BadRequestException(
      'Date of birth is required — provide dateOfBirth (ISO string) ' +
      'or dobDay + dobMonth + dobYear',
    );
  }

  private async generateStudentId(): Promise<string> {
    const counter = await this.counterModel.findOneAndUpdate(
      { name: 'studentId' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true },
    );

    const padded = String(counter.seq).padStart(3, '0');
    return `STU${padded}`;
  }

  private async generateReference(
    name: string,
    prefix: string,
    year: number,
  ): Promise<string> {
    const counter = await this.counterModel.findOneAndUpdate(
      { name: `${name}_${year}` },
      { $inc: { seq: 1 } },
      { new: true, upsert: true },
    );

    if (!counter) {
      throw new InternalServerErrorException(
        `Failed to generate ${prefix} reference`,
      );
    }

    const padded = String(counter.seq).padStart(4, '0');
    return `${prefix}-${year}-${padded}`;
  }

  private async findStudentByIdOrStudentId(
    id: string,
  ): Promise<StudentDocument> {
    if (!id?.trim()) {
      throw new BadRequestException('Student identifier is required');
    }

    const query = Types.ObjectId.isValid(id)
      ? { $or: [{ _id: id }, { studentId: id }] }
      : { studentId: id };

    const student = await this.studentModel.findOne(query).exec();

    if (!student) throw new NotFoundException('Student not found');

    return student;
  }

  // FIX: removed validateRequiredString(dto.name, ...) — 'name' not in schema
  // Now validates the fields that actually exist on CreateStudentPayload
  private validateRegistration(dto: CreateStudentPayload): void {
    this.validateRequiredString(dto.email, 'email');
    this.validateRequiredString(dto.phone, 'phone');
    this.validateRequiredString(dto.batch, 'batch');
  }

  private validateRequiredString(value: string | undefined, field: string) {
    if (!value?.trim()) {
      throw new BadRequestException(`${field} is required`);
    }
  }

  private isDuplicateKeyError(error: unknown): boolean {
    return (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as { code: number }).code === 11000
    );
  }
}