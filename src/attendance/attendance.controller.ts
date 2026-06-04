import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { AttendanceDocument } from './schemas/attendance.schema';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createAttendanceDto: CreateAttendanceDto,
  ): Promise<AttendanceDocument> {
    return this.attendanceService.create(createAttendanceDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<AttendanceDocument[]> {
    return this.attendanceService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string): Promise<AttendanceDocument> {
    return this.attendanceService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() updateAttendanceDto: UpdateAttendanceDto,
  ): Promise<AttendanceDocument> {
    return this.attendanceService.update(id, updateAttendanceDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string): Promise<void> {
    await this.attendanceService.remove(id);
  }
}
