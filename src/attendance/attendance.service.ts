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

const UPDATABLE_ATTENDANCE_FIELDS = [
  'studentId',
  'moduleId',
  'moduleName',
  'date',
  'status',
  'markedAt',
] as const;

@Injectable()
export class AttendanceService {
  constructor(
    @InjectModel(Attendance.name)
    private readonly attendanceModel: Model<AttendanceDocument>,

    @InjectModel(Student.name)
    private readonly studentModel: Model<Student>,
  ) {}

  async create(
    createAttendanceDto: CreateAttendanceDto,
  ): Promise<AttendanceDocument> {
    this.validateCreatePayload(createAttendanceDto);

    await this.ensureAttendanceDoesNotExist(
      createAttendanceDto.studentId,
      createAttendanceDto.moduleId,
      createAttendanceDto.date,
    );

    const attendance = new this.attendanceModel(createAttendanceDto);
    return attendance.save();
  }

  async findAll(): Promise<AttendanceDocument[]> {
    return this.attendanceModel.find().exec();
  }

  async findOne(id: string): Promise<AttendanceDocument> {
    this.validateObjectId(id);

    const attendance = await this.attendanceModel.findById(id).exec();

    if (!attendance) {
      throw new NotFoundException(`Attendance record with ID ${id} not found`);
    }

    return attendance;
  }

  async update(
    id: string,
    updateAttendanceDto: UpdateAttendanceDto,
  ): Promise<AttendanceDocument> {
    this.validateObjectId(id);
    this.validateUpdatePayload(updateAttendanceDto);

    await this.ensureUpdateDoesNotCreateDuplicate(id, updateAttendanceDto);

    const attendance = await this.attendanceModel
      .findByIdAndUpdate(id, updateAttendanceDto, {
        returnDocument: 'after',
        runValidators: true,
      })
      .exec();

    if (!attendance) {
      throw new NotFoundException(`Attendance record with ID ${id} not found`);
    }

    return attendance;
  }

  async remove(id: string): Promise<void> {
    this.validateObjectId(id);

    const attendance = await this.attendanceModel.findByIdAndDelete(id).exec();

    if (!attendance) {
      throw new NotFoundException(`Attendance record with ID ${id} not found`);
    }
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
        .lean()
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

      const totalPresent = attendanceRecords.filter(
        (record) => record.status === 'present',
      ).length;

      const totalAbsent = attendanceRecords.filter(
        (record) => record.status === 'absent',
      ).length;

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
          present: totalPresent,
          absent: totalAbsent,
        },
        students: groupedStudents,
      };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Failed to generate attendance report',
      );
    }
  }

  private validateCreatePayload(createAttendanceDto: CreateAttendanceDto): void {
    if (
      !createAttendanceDto ||
      typeof createAttendanceDto !== 'object' ||
      Array.isArray(createAttendanceDto)
    ) {
      throw new BadRequestException(
        'Attendance create payload must be an object',
      );
    }

    const createFields = Object.keys(createAttendanceDto);
    const invalidField = createFields.find(
      (field) =>
        !UPDATABLE_ATTENDANCE_FIELDS.includes(
          field as (typeof UPDATABLE_ATTENDANCE_FIELDS)[number],
        ),
    );

    if (invalidField) {
      throw new BadRequestException(
        `Field "${invalidField}" cannot be created on attendance records`,
      );
    }

    this.validateRequiredString(createAttendanceDto.studentId, 'studentId');
    this.validateRequiredString(createAttendanceDto.moduleId, 'moduleId');
    this.validateRequiredString(createAttendanceDto.moduleName, 'moduleName');
    this.validateRequiredString(createAttendanceDto.date, 'date');
    this.validateRequiredString(createAttendanceDto.markedAt, 'markedAt');
    this.validateStatus(createAttendanceDto.status);
  }

  private validateObjectId(id: string): void {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid attendance record ID');
    }
  }

  private validateUpdatePayload(updateAttendanceDto: UpdateAttendanceDto): void {
    if (
      !updateAttendanceDto ||
      typeof updateAttendanceDto !== 'object' ||
      Array.isArray(updateAttendanceDto)
    ) {
      throw new BadRequestException(
        'Attendance update payload must be an object',
      );
    }

    const updateFields = Object.keys(updateAttendanceDto);

    if (updateFields.length === 0) {
      throw new BadRequestException('At least one attendance field is required');
    }

    const invalidField = updateFields.find(
      (field) =>
        !UPDATABLE_ATTENDANCE_FIELDS.includes(
          field as (typeof UPDATABLE_ATTENDANCE_FIELDS)[number],
        ),
    );

    if (invalidField) {
      throw new BadRequestException(
        `Field "${invalidField}" cannot be updated on attendance records`,
      );
    }

    this.validateOptionalString(updateAttendanceDto.studentId, 'studentId');
    this.validateOptionalString(updateAttendanceDto.moduleId, 'moduleId');
    this.validateOptionalString(updateAttendanceDto.moduleName, 'moduleName');
    this.validateOptionalString(updateAttendanceDto.date, 'date');
    this.validateOptionalString(updateAttendanceDto.markedAt, 'markedAt');
    this.validateStatus(updateAttendanceDto.status);
  }

  private validateStatus(status: AttendanceStatus | undefined): void {
    if (status !== undefined && !ATTENDANCE_STATUSES.includes(status)) {
      throw new BadRequestException('Status must be either present or absent');
    }
  }

  private validateRequiredString(value: unknown, fieldName: string): void {
    if (typeof value !== 'string' || value.trim().length === 0) {
      throw new BadRequestException(`${fieldName} is required`);
    }
  }

  private validateOptionalString(value: unknown, fieldName: string): void {
    if (value !== undefined && typeof value !== 'string') {
      throw new BadRequestException(`${fieldName} must be a string`);
    }
  }

  private async ensureUpdateDoesNotCreateDuplicate(
    id: string,
    updateAttendanceDto: UpdateAttendanceDto,
  ): Promise<void> {
    const changesAttendanceIdentity =
      updateAttendanceDto.studentId !== undefined ||
      updateAttendanceDto.moduleId !== undefined ||
      updateAttendanceDto.date !== undefined;

    if (!changesAttendanceIdentity) {
      return;
    }

    const currentAttendance = await this.findOne(id);
    const studentId =
      updateAttendanceDto.studentId ?? currentAttendance.studentId;
    const moduleId =
      updateAttendanceDto.moduleId ?? currentAttendance.moduleId;
    const date = updateAttendanceDto.date ?? currentAttendance.date;

    await this.ensureAttendanceDoesNotExist(studentId, moduleId, date, id);
  }

  private async ensureAttendanceDoesNotExist(
    studentId: string,
    moduleId: string,
    date: string,
    excludedId?: string,
  ): Promise<void> {
    const duplicateAttendance = await this.attendanceModel
      .findOne({
        studentId,
        moduleId,
        date,
        ...(excludedId ? { _id: { $ne: excludedId } } : {}),
      })
      .exec();

    if (duplicateAttendance) {
      throw new ConflictException(
        'Attendance record already exists for this student, module, and date',
      );
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

  private assertDateString(value: string, field: string): void {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      throw new BadRequestException(`${field} must be in YYYY-MM-DD format`);
    }
  }

  private mapAttendanceRecord(
    record: Attendance & { _id?: unknown },
  ): AttendanceReportItem {
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