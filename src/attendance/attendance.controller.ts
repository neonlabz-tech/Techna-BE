import { Controller, Get, Query } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { AttendanceReportQueryDto } from './dto/report-query.dto';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Get('report')
  getReport(@Query() query: AttendanceReportQueryDto) {
    return this.attendanceService.getReport(query);
  }
}