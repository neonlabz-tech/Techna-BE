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
  Query,
} from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { AttendanceReportQueryDto } from './dto/report-query.dto';
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

  @Get('report')
  @HttpCode(HttpStatus.OK)
  getReport(@Query() query: AttendanceReportQueryDto) {
    return this.attendanceService.getReport(query);
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
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    await this.attendanceService.remove(id);
  }
}