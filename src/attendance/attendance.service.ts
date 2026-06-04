import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';

import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import {
  Attendance,
  AttendanceDocument,
} from './schemas/attendance.schema';

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
    this.validateCreatePayload(createAttendanceDto);

    await this.ensureAttendanceDoesNotExist(
      createAttendanceDto.studentId,
      createAttendanceDto.moduleId,
      createAttendanceDto.date,
    );

    const attendance = new this.attendanceModel(createAttendanceDto);
    return attendance.save();
  }

  // ─── FIND ALL ────────────────────────
  async findAll(): Promise<AttendanceDocument[]> {
    return this.attendanceModel.find().exec();
  }

  // ─── FIND ONE ────────────────────────
  async findOne(id: string): Promise<AttendanceDocument> {
    this.validateObjectId(id);

    const record = await this.attendanceModel.findById(id).exec();

    if (!record) {
      throw new NotFoundException(`Attendance record not found`);
    }

    return record;
  }

  // ─── FIND BY STUDENT ─────────────────
  async findByStudent(studentId: string): Promise<AttendanceDocument[]> {
    return this.attendanceModel.find({ studentId }).exec();
  }

  // ─── UPDATE ───────────────────────────
  async update(
    id: string,
    updateAttendanceDto: UpdateAttendanceDto,
  ): Promise<AttendanceDocument> {
    this.validateObjectId(id);
    this.validateUpdatePayload(updateAttendanceDto);

    await this.ensureUpdateDoesNotCreateDuplicate(id, updateAttendanceDto);

    const updated = await this.attendanceModel
      .findByIdAndUpdate(id, updateAttendanceDto, {
        new: true,
        runValidators: true,
      })
      .exec();

    if (!updated) {
      throw new NotFoundException(`Attendance record not found`);
    }

    return updated;
  }

  // ─── DELETE ──────────────────────────
  async remove(id: string): Promise<void> {
    this.validateObjectId(id);

    const deleted = await this.attendanceModel.findByIdAndDelete(id).exec();

    if (!deleted) {
      throw new NotFoundException(`Attendance record not found`);
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