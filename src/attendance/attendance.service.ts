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

  private validateCreatePayload(createAttendanceDto: CreateAttendanceDto): void {
    if (
      !createAttendanceDto ||
      typeof createAttendanceDto !== 'object' ||
      Array.isArray(createAttendanceDto)
    ) {
      throw new BadRequestException('Attendance create payload must be an object');
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
      throw new BadRequestException('Attendance update payload must be an object');
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
    const studentId = updateAttendanceDto.studentId ?? currentAttendance.studentId;
    const moduleId = updateAttendanceDto.moduleId ?? currentAttendance.moduleId;
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
}
