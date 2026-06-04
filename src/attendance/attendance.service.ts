import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Attendance } from './schemas/attendance.schema';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectModel(Attendance.name) private attendanceModel: Model<any>,
  ) {}

  async findAll() {
    return this.attendanceModel.find().lean();
  }

  async findByStudent(studentId: string) {
    return this.attendanceModel.find({ studentId }).lean();
  }

  async create(data: any) {
    return this.attendanceModel.create(data);
  }
}
