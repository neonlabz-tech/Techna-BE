import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import * as QRCode from 'qrcode';

import { Student, StudentDocument } from './schemas/student.schema';

@Injectable()
export class StudentsService {
  constructor(
    @InjectModel(Student.name)
    private readonly studentModel: Model<StudentDocument>,
  ) {}

  // ─────────────────────────────
  // GET ALL STUDENTS
  // ─────────────────────────────
  async findAll() {
    return this.studentModel.find().select('-password').lean();
  }

  // ─────────────────────────────
  // GET SINGLE STUDENT
  // ─────────────────────────────
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
  async create(data: any) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    const student = await this.studentModel.create(data);

    const { password, ...result } = student.toObject();
    return result;
  }

  // ─────────────────────────────
  // UPDATE STUDENT
  // ─────────────────────────────
  async update(id: string, data: any) {
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

  // ─────────────────────────────
  // DELETE STUDENT
  // ─────────────────────────────
  async remove(id: string) {
    const student = await this.studentModel.findByIdAndDelete(id).lean();

    if (!student) throw new NotFoundException('Student not found');

    return { message: 'Student deleted successfully' };
  }

  // ─────────────────────────────
  // APPROVE STUDENT
  // ─────────────────────────────
  async approveStudent(id: string) {
    const student = await this.findStudentByIdOrStudentId(id);

    if (student.status !== 'approved') {
      student.status = 'approved';
      student.approvedAt = new Date().toISOString();
      await student.save();
    }

    return this.generateStudentQrCode(student.studentId);
  }

  // ─────────────────────────────
  // GENERATE QR CODE
  // ─────────────────────────────
  async generateStudentQrCode(studentId: string) {
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

    if (!student.name?.trim() || !student.email?.trim()) {
      throw new BadRequestException(
        'Student name and email are required for QR generation',
      );
    }

    if (student.qrCode) {
      return student;
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
      .findByIdAndUpdate(
        student._id,
        { $set: { qrCode } },
        { new: true },
      )
      .exec();

    return updatedStudent;
  }

  // ─────────────────────────────
  // HELPER: FIND STUDENT
  // ─────────────────────────────
  private async findStudentByIdOrStudentId(id: string): Promise<StudentDocument> {
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
}