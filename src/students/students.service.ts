import {
  Injectable,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import * as QRCode from 'qrcode';

import { Student, StudentDocument } from './schemas/student.schema';
import {
  BadRequestException,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '../common/exceptions';

@Injectable()
export class StudentsService {
  constructor(
    @InjectModel(Student.name)
    private readonly studentModel: Model<StudentDocument>,
  ) {}

  async approveStudent(id: string): Promise<Student> {
    try {
      const student = await this.findStudentByIdOrStudentId(id);

      if (student.status !== 'approved') {
        student.status = 'approved';
        student.approvedAt = new Date().toISOString();
        await student.save();
      }

      return await this.generateStudentQrCode(student.studentId);
    } catch (error) {
      if (error instanceof BadRequestException || 
          error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to approve student: ' + (error instanceof Error ? error.message : 'Unknown error'),
      );
    }
  }

  async findAll(): Promise<StudentDocument[]> {
    try {
      return await this.studentModel.find().exec();
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to fetch students: ' + (error instanceof Error ? error.message : 'Unknown error'),
      );
    }
  }

  async findOne(id: string): Promise<StudentDocument> {
    try {
      return await this.findStudentByIdOrStudentId(id);
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to fetch student: ' + (error instanceof Error ? error.message : 'Unknown error'),
      );
    }
  }

  async create(body: any): Promise<StudentDocument> {
    try {
      if (!body || typeof body !== 'object') {
        throw new BadRequestException('Invalid payload');
      }

      const name = body.name?.trim();
      const email = body.email?.trim()?.toLowerCase();
      const password = body.password;

      if (!name || !email || !password) {
        throw new BadRequestException('Name, email and password are required');
      }

      const exists = await this.studentModel
        .findOne({ $or: [{ email }, { studentId: body.studentId }] })
        .exec();

      if (exists) {
        throw new ConflictException('Student with given email or studentId already exists');
      }

      const hashed = await bcrypt.hash(password, 10);

      const student = new this.studentModel({
        ...body,
        name,
        email,
        password: hashed,
        enrolledAt: body.enrolledAt ?? new Date().toISOString(),
        qrToken: body.qrToken ?? `${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`,
      });

      return await student.save();
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to create student: ' + (error instanceof Error ? error.message : 'Unknown error'),
      );
    }
  }

  async update(id: string, body: any): Promise<StudentDocument> {
    try {
      if (!body || typeof body !== 'object') {
        throw new BadRequestException('Invalid payload');
      }

      const student = await this.findStudentByIdOrStudentId(id);

      if (body.password) {
        body.password = await bcrypt.hash(body.password, 10);
      }

      const updated = await this.studentModel
        .findByIdAndUpdate(student._id, body, { returnDocument: 'after', runValidators: true })
        .exec();

      if (!updated) {
        throw new NotFoundException('Student not found');
      }

      return updated;
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to update student: ' + (error instanceof Error ? error.message : 'Unknown error'),
      );
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const student = await this.findStudentByIdOrStudentId(id);

      const deleted = await this.studentModel.findByIdAndDelete(student._id).exec();

      if (!deleted) {
        throw new NotFoundException('Student not found');
      }
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to delete student: ' + (error instanceof Error ? error.message : 'Unknown error'),
      );
    }
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
      } catch (qrError) {
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

  // ─────────────────────────────
  // HELPER: FIND STUDENT
  // ─────────────────────────────
  private async findStudentByIdOrStudentId(id: string): Promise<StudentDocument> {
    try {
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
    } catch (error) {
      if (error instanceof BadRequestException || 
          error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to find student: ' + (error instanceof Error ? error.message : 'Unknown error'),
      );
    }
  }
}