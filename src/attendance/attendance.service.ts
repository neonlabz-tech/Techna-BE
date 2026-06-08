import { Injectable } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';

import { Student } from '../students/schemas/student.schema';
import { Module as SchoolModule } from '../modules/schemas/module.schema';

import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { AttendanceReportQueryDto } from './dto/report-query.dto';
import { ScanAttendanceDto } from './dto/scan-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';

import {
  Attendance,
  AttendanceDocument,
} from './schemas/attendance.schema';
import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '../common/exceptions';

type AttendanceStatus = 'present' | 'absent';

const ATTENDANCE_STATUSES = ['present', 'absent'] as const;

@Injectable()
export class AttendanceService {
  constructor(
    @InjectModel(Attendance.name)
    private readonly attendanceModel: Model<AttendanceDocument>,

    @InjectModel(Student.name)
    private readonly studentModel: Model<any>,

    @InjectModel(SchoolModule.name)
    private readonly moduleModel: Model<any>,
  ) {}

  // CREATE ATTENDANCE
  async create(
    dto: CreateAttendanceDto,
  ): Promise<AttendanceDocument> {
    try {
      const studentExists = await this.studentModel.findOne({
        studentId: dto.studentId,
      });

      if (!studentExists) {
        throw new NotFoundException('Student not found');
      }

      // validate status
      if (!ATTENDANCE_STATUSES.includes(dto.status as AttendanceStatus)) {
        throw new BadRequestException('Invalid attendance status');
      }

      await this.ensureUniqueAttendanceSession(dto);

      // IMPORTANT FIX: store STRING, not ObjectId
      const dateToUse = dto.date ?? new Date().toISOString();
      const sessionDate = this.normalizeSessionDate(dateToUse);

      const attendance = await this.attendanceModel.create({
        ...dto,
        studentId: dto.studentId,
        date: dateToUse,
        sessionDate,
      });

      return attendance;
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }

      // MongoDB unique index violation — concurrent request safety net
      if ((error as any)?.code === 11000) {
        throw new ConflictException('Attendance already marked for this session');
      }

      const message = error instanceof Error ? error.message : 'Internal server error';
      throw new InternalServerErrorException(message);
    }
  }

  // SCAN QR ATTENDANCE
  async scanQr(
    dto: ScanAttendanceDto,
  ): Promise<{ success: true; message: string; attendance: AttendanceDocument }> {
    const qrToken = dto.qrToken?.trim();

    if (!qrToken) {
      throw new BadRequestException('QR token is required');
    }

    const student = await this.studentModel
      .findOne({ qrToken })
      .exec();

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    if (student.status !== 'approved') {
      throw new BadRequestException('Student is not approved');
    }

    // Validate module exists — rejects invalid or non-existent moduleId
    const moduleRecord = isValidObjectId(dto.moduleId)
      ? await this.moduleModel.findById(dto.moduleId).exec()
      : null;

    if (!moduleRecord) {
      throw new NotFoundException('Module not found');
    }

    const attendance = await this.create({
      studentId: student.studentId,
      moduleId: dto.moduleId,
      moduleName: moduleRecord.name,
      date: dto.date ?? new Date().toISOString(),
      status: dto.status ?? 'present',
      markedAt: dto.markedAt ?? new Date().toISOString(),
    });

    return {
      success: true,
      message: 'Attendance marked successfully',
      attendance,
    };
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

  private normalizeSessionDate(date: string): string {
    return new Date(date).toISOString().split('T')[0];
  }

  private async ensureUniqueAttendanceSession(
    dto: CreateAttendanceDto,
  ): Promise<void> {
    const normalizedDate = this.normalizeSessionDate(dto.date);

    const existing = await this.attendanceModel
      .findOne({
        studentId: dto.studentId,
        moduleId: dto.moduleId,
        date: { $regex: `^${normalizedDate}` },
      })
      .exec();

    if (existing) {
      throw new ConflictException(
        'Attendance already marked for this session',
      );
    }
  }
}