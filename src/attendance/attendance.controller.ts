import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  ForbiddenException,
} from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../enums/role.enum';

@Controller('attendance')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  // ─── GET /api/attendance  (admin + teacher) ─────────────────────────────────
  @Get()
  @Roles(Role.ADMIN, Role.TEACHER)
  findAll() {
    return this.attendanceService.findAll();
  }

  // ─── GET /api/attendance/student/:studentId  (admin + teacher + own student) ─
  @Get('student/:studentId')
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  findByStudent(@Param('studentId') studentId: string, @Request() req: any) {
    // Students can only query their own attendance
    if (req.user.role === Role.STUDENT && req.user.userId !== studentId) {
      throw new ForbiddenException('You can only view your own attendance');
    }
    return this.attendanceService.findByStudent(studentId);
  }

  // ─── POST /api/attendance  (admin + teacher) ────────────────────────────────
  @Post()
  @Roles(Role.ADMIN, Role.TEACHER)
  create(@Body() body: any) {
    return this.attendanceService.create(body);
  }
}
