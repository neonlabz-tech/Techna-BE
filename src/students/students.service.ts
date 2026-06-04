import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { Student } from './schemas/student.schema';

@Injectable()
export class StudentsService {
  constructor(
    @InjectModel(Student.name) private studentModel: Model<any>,
  ) {}

  async findAll() {
    return this.studentModel.find().select('-password').lean();
  }

  async findOne(id: string) {
    const student = await this.studentModel.findById(id).select('-password').lean();
    if (!student) throw new NotFoundException('Student not found');
    return student;
  }

  async create(data: any) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    const student = await this.studentModel.create(data);
    const { password, ...result } = student.toObject();
    return result;
  }

  async update(id: string, data: any) {
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

  async remove(id: string) {
    const student = await this.studentModel.findByIdAndDelete(id).lean();
    if (!student) throw new NotFoundException('Student not found');
    return { message: 'Student deleted successfully' };
  }
}
