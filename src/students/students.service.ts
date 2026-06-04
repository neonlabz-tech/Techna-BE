import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as QRCode from 'qrcode';
import { Student, StudentDocument } from './schemas/student.schema';

@Injectable()
export class StudentsService {
  constructor(
    @InjectModel(Student.name)
    private readonly studentModel: Model<StudentDocument>,
  ) {}

  async approveStudent(id: string): Promise<Student> {
    const student = await this.findStudentByIdOrStudentId(id);

    if (student.status !== 'approved') {
      student.status = 'approved';
      student.approvedAt = new Date().toISOString();
      await student.save();
    }

    return this.generateStudentQrCode(student.studentId);
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
