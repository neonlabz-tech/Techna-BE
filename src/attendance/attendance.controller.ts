import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';

import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { AttendanceReportQueryDto } from './dto/report-query.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { AttendanceDocument } from './schemas/attendance.schema';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../enums/role.enum';

@Controller('attendance')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post()
  @Roles(Role.ADMIN, Role.TEACHER)
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() createAttendanceDto: CreateAttendanceDto,
  ): Promise<AttendanceDocument> {
    return this.attendanceService.create(createAttendanceDto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.TEACHER)
  @HttpCode(HttpStatus.OK)
  findAll(): Promise<AttendanceDocument[]> {
    return this.attendanceService.findAll();
  }

  @Get('report')
  @Roles(Role.ADMIN, Role.TEACHER)
  @HttpCode(HttpStatus.OK)
  getReport(@Query() query: AttendanceReportQueryDto) {
    return this.attendanceService.getReport(query);
  }

  @Get('student/:studentId')
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @HttpCode(HttpStatus.OK)
  findByStudent(@Param('studentId') studentId: string, @Request() req: any) {
    if (req.user.role === Role.STUDENT && req.user.userId !== studentId) {
      throw new ForbiddenException('You can only view your own attendance');
    }

    return this.attendanceService.findByStudent(studentId);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.TEACHER)
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string): Promise<AttendanceDocument> {
    return this.attendanceService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.TEACHER)
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id') id: string,
    @Body() updateAttendanceDto: UpdateAttendanceDto,
  ): Promise<AttendanceDocument> {
    return this.attendanceService.update(id, updateAttendanceDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    await this.attendanceService.remove(id);
  }
}