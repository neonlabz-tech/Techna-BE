import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { randomUUID } from 'node:crypto';
import * as QRCode from 'qrcode';

import { EmailService } from '../email/email.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { RejectStudentDto } from './dto/reject-student.dto';
import { Student, StudentDocument } from './schemas/student.schema';

@Injectable()
export class StudentsService {
  constructor(
    @InjectModel(Student.name)
    private readonly studentModel: Model<StudentDocument>,
    private readonly emailService: EmailService,
  ) {}

  async registerStudent(createStudentDto: CreateStudentDto): Promise<Student> {
    this.validateRegistration(createStudentDto);

    const studentId = await this.generateUniqueStudentId();

    try {
      const student = await this.studentModel.create({
        ...createStudentDto,
        email: createStudentDto.email.trim().toLowerCase(),
        modules: createStudentDto.modules ?? [],
        studentId,
        qrToken: randomUUID(),
        status: 'pending',
        enrolledAt: new Date().toISOString(),
      });

      void this.emailService.sendRegistrationEmail({
        email: student.email,
        name: student.name,
        studentId: student.studentId,
      });

      return student;
    } catch (error) {
      if (this.isDuplicateKeyError(error)) {
        throw new ConflictException('Student email or ID already exists');
      }

      throw error;
    }
  }

  async approveStudent(id: string): Promise<Student> {
    const student = await this.findStudentByIdOrStudentId(id);

    if (student.status !== 'approved') {
      student.status = 'approved';
      student.approvedAt = new Date().toISOString();
      await student.save();
    }

    return this.generateStudentQrCode(student.studentId);
  }

  async rejectStudent(
    id: string,
    rejectStudentDto: RejectStudentDto,
  ): Promise<Student> {
    this.validateRequiredString(rejectStudentDto.reason, 'reason');

    const student = await this.findStudentByIdOrStudentId(id);
    const shouldSendEmail = student.status !== 'rejected';

    student.status = 'rejected';
    await student.save();

    if (shouldSendEmail) {
      void this.emailService.sendRejectionEmail({
        email: student.email,
        name: student.name,
        studentId: student.studentId,
        reason: rejectStudentDto.reason.trim(),
      });
    }

    return student;
  }

  async generateStudentQrCode(studentId: string): Promise<Student> {
    if (!studentId?.trim()) {
      throw new BadRequestException('studentId is required');
    }

    const student = await this.studentModel.findOne({ studentId }).exec();

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    if (student.status !== 'approved') {
      throw new BadRequestException(
        'QR code can only be generated for approved students',
      );
    }

    if (student.qrCode) {
      return student;
    }

    if (!student.name?.trim() || !student.email?.trim()) {
      throw new BadRequestException(
        'Student name and email are required for QR code generation',
      );
    }

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
    } catch {
      throw new InternalServerErrorException('Failed to generate QR code');
    }

    const updatedStudent = await this.studentModel
      .findOneAndUpdate(
        {
          _id: student._id,
          $or: [
            { qrCode: { $exists: false } },
            { qrCode: null },
            { qrCode: '' },
          ],
        },
        { $set: { qrCode } },
        { new: true },
      )
      .exec();

    return updatedStudent ?? this.findStudentByIdOrStudentId(student.studentId);
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

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    return student;
  }

  private validateRegistration(createStudentDto: CreateStudentDto): void {
    this.validateRequiredString(createStudentDto.name, 'name');
    this.validateRequiredString(createStudentDto.email, 'email');
    this.validateRequiredString(createStudentDto.phone, 'phone');
    this.validateRequiredString(createStudentDto.address, 'address');
    this.validateRequiredString(createStudentDto.dob, 'dob');
    this.validateRequiredString(createStudentDto.batch, 'batch');

    if (
      createStudentDto.modules !== undefined &&
      (!Array.isArray(createStudentDto.modules) ||
        createStudentDto.modules.some(
          (module) => typeof module !== 'string' || !module.trim(),
        ))
    ) {
      throw new BadRequestException('modules must be an array of strings');
    }
  }

  private validateRequiredString(
    value: string | undefined,
    field: string,
  ): void {
    if (!value?.trim()) {
      throw new BadRequestException(`${field} is required`);
    }
  }

  private async generateUniqueStudentId(): Promise<string> {
    for (let attempt = 0; attempt < 5; attempt += 1) {
      const studentId = `STU-${Date.now()}-${Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, '0')}`;

      const existingStudent = await this.studentModel.exists({ studentId });

      if (!existingStudent) {
        return studentId;
      }
    }

    throw new InternalServerErrorException('Failed to generate student ID');
  }

  private isDuplicateKeyError(error: unknown): boolean {
    return (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === 11000
    );
  }
}
