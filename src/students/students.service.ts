import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';
import { Model, Types } from 'mongoose';
import { randomUUID } from 'node:crypto';
import * as QRCode from 'qrcode';

import { EmailService } from '../email/email.service';
import { StorageService } from '../storage/storage.service';
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
  private readonly logger = new Logger(StudentsService.name);

  constructor(
    @InjectModel(Student.name)
    private readonly studentModel: Model<StudentDocument>,

    @InjectModel(Counter.name)
    private readonly counterModel: Model<CounterDocument>,

    private readonly emailService: EmailService,
    private readonly storageService: StorageService,
  ) {}

  async findAll(status?: 'pending' | 'approved' | 'rejected') {
    const filter = status ? { status } : {};
    return this.studentModel.find(filter).select('-password').lean();
  }

  async findOne(id: string) {
    const student = await this.studentModel
      .findById(id)
      .select('-password')
      .lean();

    if (!student) throw new NotFoundException('Student not found');

    return student;
  }

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

    const selectedSubjects = dto.subjectSelection.subjects ?? [];

    const payload = {
      studentId,
      qrToken: randomUUID(),
      status: 'pending' as const,
      enrolledAt: new Date().toISOString(),

      admissionNumber,
      serialNumber,
      applicationReference,

      email,
      password: await bcrypt.hash(dto.account.password, 10),

      name: dto.personal.fullNameEnglish?.trim().toUpperCase(),
      fullNameTamil: dto.personal.fullNameTamil?.trim(),
      fullNameEnglish: dto.personal.fullNameEnglish?.trim().toUpperCase(),
      dateOfBirth,
      dob: dateOfBirth.toISOString(),

      nicNo: dto.personal.nicNo?.trim(),
      school: dto.personal.school?.trim(),

      whatsappNo: dto.personal.whatsappNo?.trim(),
      phone: dto.personal.whatsappNo?.trim(),

      parentsNo: dto.personal.parentsNo?.trim(),

      permanentAddress: dto.personal.permanentAddress?.trim(),
      address: dto.personal.permanentAddress?.trim(),

      administrativeDistrict: dto.personal.administrativeDistrict,
      fixedTelephone: dto.personal.fixedTelephone?.trim(),
      residingSince: dto.personal.residingSince?.trim(),
      race: dto.personal.race,
      religion: dto.personal.religion,
      citizenByDescent: dto.personal.citizenByDescent ?? 'YES',
      contactAddress: dto.personal.contactAddress?.trim(),
      postalCode: dto.personal.postalCode?.trim(),

      fatherName: dto.parent?.fatherName?.trim().toUpperCase(),
      motherName: dto.parent?.motherName?.trim().toUpperCase(),
      guardianName: dto.parent?.guardianName?.trim().toUpperCase(),
      contactPerson: dto.parent?.contactPerson ?? 'Mother',
      guardianAddress: dto.parent?.guardianAddress?.trim(),
      guardianFixedTel: dto.parent?.guardianFixedTel?.trim(),
      guardianMobile: dto.parent?.guardianMobile?.trim(),

      parentName:
        dto.parent?.motherName?.trim().toUpperCase() ||
        dto.parent?.fatherName?.trim().toUpperCase() ||
        dto.parent?.guardianName?.trim().toUpperCase(),

      parentPhone:
        dto.personal.parentsNo?.trim() || dto.parent?.guardianMobile?.trim(),

      olCategory: dto.olRecords?.olCategory ?? 'Local O/L',
      olYear: dto.olRecords?.olYear?.trim(),
      olIndexNumber: dto.olRecords?.olIndexNumber?.trim(),
      olNameUsed: dto.olRecords?.olNameUsed?.trim().toUpperCase(),
      olAccept: dto.olRecords?.olAccept ?? 'Accept',
      olResults: dto.olRecords?.olResults ?? [],

      subjects: selectedSubjects,
      modules: selectedSubjects,
      agreed: dto.subjectSelection.agreed,

      batch: dto.batch?.trim() || '',
    };

    try {
      const student = await this.studentModel.create(payload);

      void this.emailService.sendRegistrationEmail({
        email: student.email,
        name: student.fullNameEnglish ?? student.email,
        studentId: student.studentId,
      });

      const result = student.toObject() as { password?: string };
      delete result.password;

      return {
        message: 'Registration submitted successfully. Awaiting admin approval.',
        data: result,
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

  async create(data: CreateStudentPayload) {
    this.validateRegistration(data);

    const selectedSubjects = data.subjects?.length
      ? data.subjects
      : data.modules?.length
        ? data.modules
        : [];

    const payload: CreateStudentPayload = {
      ...data,
      email: data.email.trim().toLowerCase(),
      phone: data.whatsappNo?.trim() || data.phone?.trim() || '',
      whatsappNo: data.whatsappNo?.trim() || data.phone?.trim() || '',
      parentsNo: data.parentsNo?.trim() || data.parentPhone?.trim(),
      batch: data.batch.trim(),
      name: data.fullNameEnglish?.trim() || data.name?.trim() || data.email,
      fullNameEnglish:
        data.fullNameEnglish?.trim().toUpperCase() ||
        data.name?.trim().toUpperCase() ||
        data.email,
      address: data.permanentAddress?.trim() || data.address?.trim(),
      permanentAddress: data.permanentAddress?.trim() || data.address?.trim(),
      dateOfBirth: data.dateOfBirth,
      parentName:
        data.motherName?.trim() ||
        data.fatherName?.trim() ||
        data.guardianName?.trim() ||
        data.parentName?.trim(),
      parentPhone:
        data.parentsNo?.trim() ||
        data.guardianMobile?.trim() ||
        data.parentPhone?.trim(),
      modules: selectedSubjects,
      subjects: selectedSubjects,
      studentId: data.studentId?.trim() || (await this.generateStudentId()),
      qrToken: data.qrToken?.trim() || randomUUID(),
      status: data.status ?? 'pending',
      enrolledAt: data.enrolledAt ?? new Date().toISOString(),
    };

    payload.password = await bcrypt.hash(payload.password || 'Student@123', 10);

    try {
      const student = await this.studentModel.create(payload);

      void this.emailService.sendRegistrationEmail({
        email: student.email,
        name: student.fullNameEnglish ?? student.email,
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

  async update(id: string, data: UpdateStudentPayload) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    const selectedSubjects = data.subjects?.length
      ? data.subjects
      : data.modules?.length
        ? data.modules
        : undefined;

    const payload = {
      ...data,
      ...(selectedSubjects
        ? {
            subjects: selectedSubjects,
            modules: selectedSubjects,
          }
        : {}),
    };

    const student = await this.studentModel
      .findByIdAndUpdate(id, payload, {
        returnDocument: 'after',
        runValidators: true,
      })
      .select('-password')
      .lean();

    if (!student) throw new NotFoundException('Student not found');

    return student;
  }

  async remove(id: string) {
    const student = await this.studentModel.findById(id).lean();

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    if (student.qrImageKey) {
      try {
        await this.storageService.deleteObject(student.qrImageKey);
      } catch (error) {
        this.logger.error(
          'Failed to delete QR image from R2',
          error instanceof Error ? error.message : String(error),
        );
      }
    }

    await this.studentModel.findByIdAndDelete(id);

    return {
      message: 'Student and QR deleted successfully',
    };
  }

  async approveStudent(id: string): Promise<Student> {
    const student = await this.findStudentByIdOrStudentId(id);
    const shouldSendEmail = student.status !== 'approved';

    student.status = 'approved';
    student.approvedAt = new Date().toISOString();
    student.rejectionReason = undefined;
    await student.save();

    if (shouldSendEmail) {
      void this.emailService.sendApprovalEmail({
        email: student.email,
        name: student.fullNameEnglish ?? student.email,
        studentId: student.studentId,
      });
    }

    try {
      return await this.generateStudentQrCode(student.studentId);
    } catch (error) {
      this.logger.error(
        'QR generation/upload failed',
        error instanceof Error ? error.message : String(error),
      );

      const approvedStudent = await this.studentModel
        .findById(student._id)
        .select('-password')
        .exec();

      return approvedStudent ?? student;
    }
  }

  async rejectStudent(id: string, dto: RejectStudentDto): Promise<object> {
    const student = await this.findStudentByIdOrStudentId(id);
    const shouldSendEmail = student.status !== 'rejected';

    student.status = 'rejected';
    student.rejectionReason = dto.reason.trim();
    await student.save();

    if (shouldSendEmail) {
      void this.emailService.sendRejectionEmail({
        email: student.email,
        name: student.fullNameEnglish ?? student.email,
        studentId: student.studentId,
        reason: dto.reason.trim(),
      });
    }

    return {
      message: 'Student registration rejected.',
      data: {
        _id: student._id,
        studentId: student.studentId,
        status: student.status,
        rejectionReason: student.rejectionReason,
      },
    };
  }

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

    return {
      studentId: (student._id as Types.ObjectId).toString(),
      studentCode: student.studentId,
      name: student.fullNameEnglish ?? '',
      email: student.email,
      phone: student.phone ?? student.whatsappNo ?? '',
      modules: student.subjects?.length
        ? student.subjects
        : student.modules ?? [],
      batch: student.batch ?? '',
      status: student.status,
      enrolledAt: student.enrolledAt,
      approvedAt: student.approvedAt ?? null,
      rejectionReason: student.rejectionReason,
    };
  }

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

    const qrPayload = {
      studentId: student.studentId,
      fullName: student.fullNameEnglish ?? '',
      email: student.email,
      admissionNo: student.admissionNumber,
    };

    try {
      const qrCode = await QRCode.toDataURL(JSON.stringify(qrPayload), {
        errorCorrectionLevel: 'M',
        margin: 1,
        width: 300,
      });

      const qrBuffer = await QRCode.toBuffer(JSON.stringify(qrPayload), {
        errorCorrectionLevel: 'M',
        margin: 1,
        type: 'png',
        width: 300,
      });

      const uploadedQr = await this.storageService.uploadQrImage({
        body: qrBuffer,
        originalName: `${student.studentId}.png`,
        contentType: 'image/png',
        scope: student.studentId,
        metadata: {
          studentId: student.studentId,
        },
      });

      const updated = await this.studentModel
        .findByIdAndUpdate(
          student._id,
          {
            $set: {
              qrCode,
              qrCodeUrl: uploadedQr.publicUrl,
              qrImageKey: uploadedQr.key,
            },
          },
          { returnDocument: 'after' },
        )
        .select('-password');

      return updated ?? student;
    } catch (error) {
      this.logger.error(
        `QR generation/upload failed for student ${studentId}`,
        error instanceof Error ? error.message : String(error),
      );

      const fallback = await this.studentModel
        .findOne({ studentId })
        .select('-password')
        .lean();

      return (fallback ?? student) as unknown as Student;
    }
  }

  private resolveDateOfBirth(personal: RegisterStudentDto['personal']): Date {
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
      'Date of birth is required — provide dateOfBirth or dobDay + dobMonth + dobYear',
    );
  }

  private async generateStudentId(): Promise<string> {
    const counter = await this.counterModel.findOneAndUpdate(
      { name: 'studentId' },
      { $inc: { seq: 1 } },
      {
        returnDocument: 'after',
        upsert: true,
      },
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
      {
        returnDocument: 'after',
        upsert: true,
      },
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

  private validateRegistration(dto: CreateStudentPayload): void {
    this.validateRequiredString(dto.email, 'email');
    this.validateRequiredString(dto.phone ?? dto.whatsappNo, 'phone');
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