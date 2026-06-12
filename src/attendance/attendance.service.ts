import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';

import { Student } from '../students/schemas/student.schema';
import { Module as SchoolModule, SchoolModuleDocument } from '../modules/schemas/module.schema';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { AttendanceReportQueryDto } from './dto/report-query.dto';
import { ScanAttendanceDto } from './dto/scan-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { Attendance, AttendanceDocument } from './schemas/attendance.schema';
import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '../common/exceptions';

type AttendanceStatus = 'present' | 'absent';

type AttendanceReportItem = {
  id: string;
  studentId: string;
  moduleId: string;
  moduleName: string;
  date: string;
  status: AttendanceStatus;
  markedAt: string;
};

const ATTENDANCE_STATUSES = ['present', 'absent'] as const;

@Injectable()
export class AttendanceService {
  constructor(
    @InjectModel(Attendance.name)
    private readonly attendanceModel: Model<AttendanceDocument>,

    @InjectModel(Student.name)
    private readonly studentModel: Model<Student>,

    @InjectModel(SchoolModule.name)
    private readonly moduleModel: Model<SchoolModuleDocument>,
  ) {}

  async create(dto: CreateAttendanceDto): Promise<AttendanceDocument> {
    try {
      const studentExists = await this.studentModel.findOne({
        studentId: dto.studentId,
      });

      if (!studentExists) {
        throw new NotFoundException('Student not found');
      }

      if (!ATTENDANCE_STATUSES.includes(dto.status as AttendanceStatus)) {
        throw new BadRequestException('Invalid attendance status');
      }

      await this.ensureUniqueAttendanceSession(dto);

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

      if ((error as any)?.code === 11000) {
        throw new ConflictException('Attendance already marked for this session');
      }

      const message = error instanceof Error ? error.message : 'Internal server error';
      throw new InternalServerErrorException(message);
    }
  }

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


  async findAll(): Promise<AttendanceDocument[]> {
    return this.attendanceModel
      .find()
      .populate('studentId')
      .sort({ createdAt: -1 })
      .exec();
  }

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

  async update(id: string, dto: UpdateAttendanceDto): Promise<AttendanceDocument> {
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

  async remove(id: string): Promise<void> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid attendance id');
    }

    const deleted = await this.attendanceModel.findByIdAndDelete(id);

    if (!deleted) {
      throw new NotFoundException('Attendance not found');
    }
  }

  async findByStudent(studentId: string): Promise<AttendanceDocument[]> {
    const student = await this.studentModel.findOne({ studentId });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    return this.attendanceModel
      .find({ studentId })
      .sort({ createdAt: -1 })
      .exec();
  }

  async getReport(query: AttendanceReportQueryDto) {
    try {
      const dateFilter = this.buildDateFilter(query.date, query.from, query.to);
      const studentFilter: Record<string, unknown> = { status: 'approved' };

      if (query.studentId) {
        studentFilter.studentId = query.studentId;
        delete studentFilter.status;
      }

      if (query.batch) {
        studentFilter.batch = query.batch;
      }

      if (query.moduleId) {
        studentFilter.modules = query.moduleId;
      }

      const students = await this.studentModel
        .find(studentFilter)
        .select('studentId name batch modules status')
        .lean<{ studentId: string; name?: string; batch: string; modules: string[]; status: string }[]>()
        .exec();

      if (query.studentId && students.length === 0) {
        throw new NotFoundException(`Student ${query.studentId} not found`);
      }

      const studentIds = students.map((student) => student.studentId);
      const attendanceFilter: Record<string, unknown> = {};

      if (studentIds.length > 0) {
        attendanceFilter.studentId = { $in: studentIds };
      } else if (query.studentId) {
        attendanceFilter.studentId = query.studentId;
      }

      if (query.moduleId) {
        attendanceFilter.moduleId = query.moduleId;
      }

      if (dateFilter) {
        attendanceFilter.date = dateFilter;
      }

      const attendanceRecords = await this.attendanceModel
        .find(attendanceFilter)
        .sort({ date: 1, studentId: 1, moduleId: 1 })
        .lean()
        .exec();

      const groupedStudents = students.map((student) => {
        const records = attendanceRecords.filter(
          (record) => record.studentId === student.studentId,
        );

        return {
          id: student.studentId,
          studentId: student.studentId,
          name: student.name,
          batch: student.batch,
          modules: student.modules,
          attendance: records.map((record) => this.mapAttendanceRecord(record)),
        };
      });

      return {
        filters: {
          studentId: query.studentId ?? null,
          moduleId: query.moduleId ?? null,
          batch: query.batch ?? null,
          from: query.from ?? null,
          to: query.to ?? null,
          date: query.date ?? null,
        },
        summary: {
          totalStudents: groupedStudents.length,
          totalRecords: attendanceRecords.length,
          present: attendanceRecords.filter((r) => r.status === 'present').length,
          absent: attendanceRecords.filter((r) => r.status === 'absent').length,
        },
        students: groupedStudents,
      };
    } catch (error: unknown) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException('Failed to generate attendance report');
    }
  }

  private buildDateFilter(
    date?: string,
    from?: string,
    to?: string,
  ): string | { $gte?: string; $lte?: string } | undefined {
    if (date) {
      this.assertDateString(date, 'date');
      return date;
    }

    if (!from && !to) {
      return undefined;
    }

    if (from) {
      this.assertDateString(from, 'from');
    }

    if (to) {
      this.assertDateString(to, 'to');
    }

    if (from && to && from > to) {
      throw new BadRequestException('from must be less than or equal to to');
    }

    return {
      ...(from ? { $gte: from } : {}),
      ...(to ? { $lte: to } : {}),
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

  private assertDateString(value: string, field: string): void {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      throw new BadRequestException(`${field} must be in YYYY-MM-DD format`);
    }
  }

  private mapAttendanceRecord(record: Attendance & { _id?: unknown }): AttendanceReportItem {
    return {
      id: String(record._id ?? ''),
      studentId: record.studentId,
      moduleId: record.moduleId,
      moduleName: record.moduleName,
      date: record.date,
      status: record.status,
      markedAt: record.markedAt,
    };
  }
}
