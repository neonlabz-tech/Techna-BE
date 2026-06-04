import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { Teacher } from './schemas/teacher.schema';

@Injectable()
export class TeachersService {
  constructor(
    @InjectModel(Teacher.name) private teacherModel: Model<any>,
  ) {}

  async findAll() {
    return this.teacherModel.find().select('-password').lean();
  }

  async findOne(id: string) {
    const teacher = await this.teacherModel.findById(id).select('-password').lean();
    if (!teacher) throw new NotFoundException('Teacher not found');
    return teacher;
  }

  async create(data: any) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    const teacher = await this.teacherModel.create(data);
    const { password, ...result } = teacher.toObject();
    return result;
  }

  async update(id: string, data: any) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    const teacher = await this.teacherModel
      .findByIdAndUpdate(id, data, { new: true, runValidators: true })
      .select('-password')
      .lean();
    if (!teacher) throw new NotFoundException('Teacher not found');
    return teacher;
  }

  async remove(id: string) {
    const teacher = await this.teacherModel.findByIdAndDelete(id).lean();
    if (!teacher) throw new NotFoundException('Teacher not found');
    return { message: 'Teacher deleted successfully' };
  }
}
