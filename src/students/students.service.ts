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

  // ─────────────────────────────────────────────────────────────
  // FIND ALL
  // ─────────────────────────────────────────────────────────────
  async findAll(status?: 'pending' | 'approved' | 'rejected') {
    const filter = status ? { status } : {};
    return this.studentModel.find(filter).select('-password').lean();
  }

  // ─────────────────────────────────────────────────────────────
  // FIND ONE
  // ─────────────────────────────────────────────────────────────
  async findOne(id: string) {
    const student = await this.studentModel
      .findById(id)
      .select('-password')
      .lean();

    if (!student) throw new NotFoundException('Student not found');

    return student;
  }

  // ─────────────────────────────────────────────────────────────
  // REGISTER STUDENT (PUBLIC)
  // ─────────────────────────────────────────────────────────────
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
      throw new ConflictException('Email already exists');
    }

    if (dto.personal.nicNo) {
      const existingNic = await this.studentModel
        .findOne({ nicNo: dto.personal.nicNo.trim() })
        .lean();

      if (existingNic) {
        throw new ConflictException('NIC already exists');
      }
    }

    const year = new Date().getFullYear();

    const [studentId, admissionNumber, serialNumber, applicationReference] =
      await Promise.all([
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

      fullNameTamil: dto.personal.fullNameTamil?.trim(),
      fullNameEnglish: dto.personal.fullNameEnglish.trim().toUpperCase(),
      dateOfBirth,
      nicNo: dto.personal.nicNo.trim(),
      school: dto.personal.school?.trim(),
      whatsappNo: dto.personal.whatsappNo.trim(),
      phone: dto.personal.whatsappNo.trim(),
      parentsNo: dto.personal.parentsNo?.trim(),
      permanentAddress: dto.personal.permanentAddress.trim(),
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

      olCategory: dto.olRecords?.olCategory ?? 'Local O/L',
      olYear: dto.olRecords?.olYear?.trim(),
      olIndexNumber: dto.olRecords?.olIndexNumber?.trim(),
      olNameUsed: dto.olRecords?.olNameUsed?.trim().toUpperCase(),
      olAccept: dto.olRecords?.olAccept ?? 'Accept',
      olResults: dto.olRecords?.olResults ?? [],

      subjects: dto.subjectSelection.subjects,
      agreed: dto.subjectSelection.agreed,

      batch: dto.batch?.trim() ?? 'N/A',
      modules: dto.subjectSelection.subjects,
    };

    const student = await this.studentModel.create(payload);

    void this.emailService.sendRegistrationEmail({
      email: student.email,
      name: student.fullNameEnglish ?? student.email,
      studentId: student.studentId,
    });

    return {
      message: 'Registration submitted successfully',
      data: {
        studentId: student.studentId,
        email: student.email,
        status: student.status,
      },
    };
  }

  // ─────────────────────────────────────────────────────────────
  // APPROVE STUDENT (FIXED)
  // ─────────────────────────────────────────────────────────────
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

  // ─────────────────────────────────────────────────────────────
  // REJECT STUDENT
  // ─────────────────────────────────────────────────────────────
  async rejectStudent(id: string, dto: RejectStudentDto) {
    const student = await this.findStudentByIdOrStudentId(id);

    student.status = 'rejected';
    student.rejectionReason = dto.reason.trim();
    await student.save();

    return {
      message: 'Student rejected',
      data: student,
    };
  }

  // ─────────────────────────────────────────────────────────────
  // QR CODE GENERATION (FIXED)
  // ─────────────────────────────────────────────────────────────
  async generateStudentQrCode(studentId: string): Promise<Student> {
    const student = await this.studentModel.findOne({ studentId }).exec();

    if (!student) throw new NotFoundException('Student not found');

    if (student.status !== 'approved') {
      throw new BadRequestException('Student not approved');
    }

    if (student.qrCode) return student;

    const qrPayload = {
      studentId: student.studentId,
      fullName: student.fullNameEnglish ?? '',
      email: student.email,
      admissionNo: student.admissionNumber,
    };

    const qrCode = await QRCode.toDataURL(JSON.stringify(qrPayload));

    const updated = await this.studentModel.findByIdAndUpdate(
      student._id,
      { qrCode },
      { new: true },
    );

    return updated ?? student;
  }

  // ─────────────────────────────────────────────────────────────
  // HELPERS
  // ─────────────────────────────────────────────────────────────
  private resolveDateOfBirth(personal: RegisterStudentDto['personal']): Date {
    if (personal.dateOfBirth) {
      const d = new Date(personal.dateOfBirth);
      if (isNaN(d.getTime())) {
        throw new BadRequestException('Invalid DOB');
      }
      return d;
    }

    const d = new Date(
      personal.dobYear,
      personal.dobMonth - 1,
      personal.dobDay,
    );

    if (isNaN(d.getTime())) {
      throw new BadRequestException('Invalid DOB fields');
    }

    return d;
  }

  private async generateStudentId(): Promise<string> {
    const counter = await this.counterModel.findOneAndUpdate(
      { name: 'studentId' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true },
    );

    return `STU${String(counter.seq).padStart(3, '0')}`;
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

    return `${prefix}-${year}-${String(counter.seq).padStart(4, '0')}`;
  }

  private async findStudentByIdOrStudentId(id: string) {
    const query = Types.ObjectId.isValid(id)
      ? { $or: [{ _id: id }, { studentId: id }] }
      : { studentId: id };

    const student = await this.studentModel.findOne(query);

    if (!student) throw new NotFoundException('Student not found');

    return student;
  }
}