import {
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';

import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import {
  Attendance,
  AttendanceDocument,
} from './schemas/attendance.schema';
import {
  BadRequestException,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '../common/exceptions';

type AttendanceStatus = 'present' | 'absent';

const ATTENDANCE_STATUSES = ['present', 'absent'] as const;

const ALLOWED_FIELDS = [
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
  ) {}

  // ─── CREATE ─────────────────────────
  async create(
    createAttendanceDto: CreateAttendanceDto,
  ): Promise<AttendanceDocument> {
    try {
      this.validateCreatePayload(createAttendanceDto);
      await this.ensureAttendanceDoesNotExist(
        createAttendanceDto.studentId,
        createAttendanceDto.moduleId,
        createAttendanceDto.date,
      );

      const attendance = new this.attendanceModel(createAttendanceDto);

      return await attendance.save();
    } catch (error) {
      if (error instanceof BadRequestException || 
          error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to create attendance: ' + (error instanceof Error ? error.message : 'Unknown error'),
      );
    }
  }

  // ─── FIND ALL ────────────────────────
  async findAll(): Promise<AttendanceDocument[]> {
    try {
      return await this.attendanceModel.find().exec();
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to fetch attendance records: ' + (error instanceof Error ? error.message : 'Unknown error'),
      );
    }
  }

  async findOne(id: string): Promise<AttendanceDocument> {
    try {
      this.validateObjectId(id);

      const attendance = await this.attendanceModel.findById(id).exec();

      if (!attendance) {
        throw new NotFoundException(`Attendance record with ID ${id} not found`);
      }

      return attendance;
    } catch (error) {
      if (error instanceof BadRequestException || 
          error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to fetch attendance: ' + (error instanceof Error ? error.message : 'Unknown error'),
      );
    }
  }

  async findByStudent(studentId: string): Promise<AttendanceDocument[]> {
    try {
      if (!studentId?.trim()) {
        throw new BadRequestException('Student ID is required');
      }

      return await this.attendanceModel.find({ studentId }).exec();
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to fetch attendance for student: ' + (error instanceof Error ? error.message : 'Unknown error'),
      );
    }
  }

  // ─── UPDATE ───────────────────────────
  async update(
    id: string,
    updateAttendanceDto: UpdateAttendanceDto,
  ): Promise<AttendanceDocument> {
    try {
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
    } catch (error) {
      if (error instanceof BadRequestException || 
          error instanceof NotFoundException ||
          error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to update attendance: ' + (error instanceof Error ? error.message : 'Unknown error'),
      );
    }
  }

  // ─── DELETE ──────────────────────────
  async remove(id: string): Promise<void> {
    try {
      this.validateObjectId(id);

      const attendance = await this.attendanceModel.findByIdAndDelete(id).exec();

      if (!attendance) {
        throw new NotFoundException(`Attendance record with ID ${id} not found`);
      }
    } catch (error) {
      if (error instanceof BadRequestException || 
          error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to delete attendance: ' + (error instanceof Error ? error.message : 'Unknown error'),
      );
    }
  }

  // ─── VALIDATIONS ─────────────────────
  private validateObjectId(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid ID');
    }
  }

  private validateCreatePayload(dto: CreateAttendanceDto) {
    if (!dto || typeof dto !== 'object') {
      throw new BadRequestException('Invalid payload');
    }

    this.validateStatus(dto.status);
  }

  private validateUpdatePayload(dto: UpdateAttendanceDto) {
    if (!dto || typeof dto !== 'object') {
      throw new BadRequestException('Invalid payload');
    }

    this.validateStatus(dto.status);
  }

  private validateStatus(status?: AttendanceStatus) {
    if (status && !ATTENDANCE_STATUSES.includes(status)) {
      throw new BadRequestException('Status must be present or absent');
    }
  }

  // ─── DUPLICATE CHECK ─────────────────
  private async ensureAttendanceDoesNotExist(
    studentId: string,
    moduleId: string,
    date: string,
    excludedId?: string,
  ) {
    const exists = await this.attendanceModel.findOne({
      studentId,
      moduleId,
      date,
      ...(excludedId ? { _id: { $ne: excludedId } } : {}),
    });

    if (exists) {
      throw new ConflictException(
        'Attendance already exists for this student/module/date',
      );
    }
  }

  private async ensureUpdateDoesNotCreateDuplicate(
    id: string,
    dto: UpdateAttendanceDto,
  ) {
    const current = await this.findOne(id);

    const studentId = dto.studentId ?? current.studentId;
    const moduleId = dto.moduleId ?? current.moduleId;
    const date = dto.date ?? current.date;

    await this.ensureAttendanceDoesNotExist(
      studentId,
      moduleId,
      date,
      id,
    );
  }
}