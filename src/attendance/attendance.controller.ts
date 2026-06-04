import {
<<<<<<< HEAD
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
=======
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
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    await this.attendanceService.remove(id);
>>>>>>> 823465b60ba6f481fefb3cb89d7b02c5622a61b8
  }
}
