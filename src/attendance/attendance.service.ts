import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';

import { Student } from '../students/schemas/student.schema';

import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { AttendanceReportQueryDto } from './dto/report-query.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';

import {
  Attendance,
  AttendanceDocument,
} from './schemas/attendance.schema';

type AttendanceStatus = 'present' | 'absent';

const ATTENDANCE_STATUSES = ['present', 'absent'] as const;

@Injectable()
export class AttendanceService {
  constructor(
    @InjectModel(Attendance.name)
    private readonly attendanceModel: Model<AttendanceDocument>,

    @InjectModel(Student.name)
    private readonly studentModel: Model<any>,
  ) {}

  // CREATE ATTENDANCE
  async create(
    dto: CreateAttendanceDto,
  ): Promise<AttendanceDocument> {
    try {
      // validate student
      const studentExists = await this.studentModel.findById(dto.studentId);

      if (!studentExists) {
        throw new NotFoundException('Student not found');
      }

      // validate status
      if (!ATTENDANCE_STATUSES.includes(dto.status as AttendanceStatus)) {
        throw new BadRequestException('Invalid attendance status');
      }

      // IMPORTANT FIX: store STRING, not ObjectId
      const attendance = await this.attendanceModel.create({
        ...dto,
        studentId: dto.studentId, // ✅ FIXED HERE
        date: dto.date ?? new Date(),
      });

      return attendance;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  // GET ALL
  async findAll(): Promise<AttendanceDocument[]> {
    return this.attendanceModel
      .find()
      .populate('studentId')
      .sort({ createdAt: -1 })
      .exec();
  }

  // GET ONE
  async findOne(id: string): Promise<AttendanceDocument> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid attendance id');
    }

    const attendance = await this.attendanceModel
      .findById(id)
      .populate('studentId')
      .exec();

    if (!attendance) {
      throw new NotFoundException('Attendance not found');
    }

    return attendance;
  }

  // UPDATE
  async update(
    id: string,
    dto: UpdateAttendanceDto,
  ): Promise<AttendanceDocument> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid attendance id');
    }

    const updated = await this.attendanceModel
      .findByIdAndUpdate(id, dto, {
        new: true,
        runValidators: true,
      })
      .exec();

    if (!updated) {
      throw new NotFoundException('Attendance not found');
    }

    return updated;
  }

  // DELETE
  async remove(id: string): Promise<void> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid attendance id');
    }

    const deleted = await this.attendanceModel.findByIdAndDelete(id);

    if (!deleted) {
      throw new NotFoundException('Attendance not found');
    }
  }

  // GET BY STUDENT
  async findByStudent(studentId: string): Promise<AttendanceDocument[]> {
    const student = await this.studentModel.findOne({ studentId });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    return this.attendanceModel
      .find({ studentId: studentId }) // ✅ keep string consistent
      .sort({ createdAt: -1 })
      .exec();
  }

  // REPORT
  async getReport(query: AttendanceReportQueryDto) {
    const filter: any = {};

    if (query.studentId) {
      const student = await this.studentModel.findOne({
        studentId: query.studentId,
      });

      if (!student) {
        throw new NotFoundException('Student not found');
      }

      filter.studentId = query.studentId;
    }

    if (query.from || query.to) {
      filter.date = {};
      if (query.from) filter.date.$gte = new Date(query.from);
      if (query.to) filter.date.$lte = new Date(query.to);
    }

    const data = await this.attendanceModel
      .find(filter)
      .populate('studentId')
      .exec();

    const present = data.filter((d: any) => d.status === 'present').length;

    return {
      total: data.length,
      present,
      absent: data.length - present,
      records: data,
    };
  }
}