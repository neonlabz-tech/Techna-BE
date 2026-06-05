import {
  BadRequestException,
  ConflictException,
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
import { RejectStudentDto } from './dto/reject-student.dto';
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
    private readonly emailService: EmailService,
  ) {}

  async findAll() {
    return this.studentModel.find().select('-password').lean();
  }

  async findOne(id: string) {
    const student = await this.studentModel
      .findById(id)
      .select('-password')
      .lean();

    if (!student) throw new NotFoundException('Student not found');

    return student;
  }

  // ─────────────────────────────
  // CREATE STUDENT
  // ─────────────────────────────
  async create(data: CreateStudentPayload) {
    this.validateRegistration(data);

    const payload: CreateStudentPayload = {
      ...data,
      email: data.email.trim().toLowerCase(),
      modules: data.modules ?? [],
      studentId:
        data.studentId?.trim() || (await this.generateUniqueStudentId()),
      qrToken: data.qrToken?.trim() || randomUUID(),
      status: data.status ?? 'pending',
      enrolledAt: data.enrolledAt ?? new Date().toISOString(),
    };

    if (payload.password) {
      payload.password = await bcrypt.hash(payload.password, 10);
    }

    try {
      const student = await this.studentModel.create(payload);

      void this.emailService.sendRegistrationEmail({
        email: student.email,
        name: student.name,
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

  async registerStudent(createStudentDto: CreateStudentPayload) {
    return this.create(createStudentDto);
  }

  // ─────────────────────────────
  // UPDATE STUDENT
  // ─────────────────────────────
  async update(id: string, data: UpdateStudentPayload) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    const student = await this.studentModel
      .findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
      })
      .select('-password')
      .lean();

    if (!student) throw new NotFoundException('Student not found');

    return student;
  }

  async remove(id: string) {
    const student = await this.studentModel.findByIdAndDelete(id).lean();

    if (!student) throw new NotFoundException('Student not found');

    return { message: 'Student deleted successfully' };
  }

  // ─────────────────────────────
  // APPROVE STUDENT
  // ─────────────────────────────
  async approveStudent(id: string): Promise<Student> {
    const student = await this.findStudentByIdOrStudentId(id);

      if (student.status !== 'approved') {
        student.status = 'approved';
        student.approvedAt = new Date().toISOString();
        await student.save();
      }

    return this.generateStudentQrCode(student.studentId);
  }

  // ─────────────────────────────
  // REJECT STUDENT
  // ─────────────────────────────
  async rejectStudent(id: string, dto: RejectStudentDto): Promise<Student> {
    this.validateRequiredString(dto.reason, 'reason');

    const student = await this.findStudentByIdOrStudentId(id);
    const shouldSendEmail = student.status !== 'rejected';

    student.status = 'rejected';
    await student.save();

    if (shouldSendEmail) {
      void this.emailService.sendRejectionEmail({
        email: student.email,
        name: student.name,
        studentId: student.studentId,
        reason: dto.reason.trim(),
      });
    }

    return student;
  }

  // ─────────────────────────────
  // GENERATE QR CODE
  // ─────────────────────────────
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

    if (student.qrCode) {
      return student;
    }

    if (student.qrCode) return student;

      const qrPayload = {
        studentId: student.studentId,
        fullName: student.name,
        email: student.email,
      };

      let qrCode: string;

      try {
        qrCode = await QRCode.toDataURL(JSON.stringify(qrPayload), {
          errorCorrectionLevel: 'M',
          margin: 1,
          type: 'image/png',
          width: 300,
        });
      } catch (qrError) {
        throw new InternalServerErrorException('Failed to generate QR code');
      }

    const updated = await this.studentModel.findByIdAndUpdate(
      student._id,
      { $set: { qrCode } },
      { new: true },
    );

    return updated ?? student;
  }

  // ─────────────────────────────
  // HELPERS
  // ─────────────────────────────
  private async findStudentByIdOrStudentId(id: string): Promise<StudentDocument> {
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
    this.validateRequiredString(dto.name, 'name');
    this.validateRequiredString(dto.email, 'email');
    this.validateRequiredString(dto.phone, 'phone');
    this.validateRequiredString(dto.address, 'address');
    this.validateRequiredString(dto.dob, 'dob');
    this.validateRequiredString(dto.batch, 'batch');
  }

  private validateRequiredString(value: string | undefined, field: string) {
    if (!value?.trim()) {
      throw new BadRequestException(`${field} is required`);
    }
  }

  private async generateUniqueStudentId(): Promise<string> {
    for (let i = 0; i < 5; i++) {
      const studentId = `STU-${Date.now()}-${Math.floor(
        Math.random() * 1000,
      )
        .toString()
        .padStart(3, '0')}`;

      const exists = await this.studentModel.exists({ studentId });

      if (!exists) return studentId;
    }

    throw new InternalServerErrorException('Failed to generate student ID');
  }

  private isDuplicateKeyError(error: unknown): boolean {
    return (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as any).code === 11000
    );
  }
}