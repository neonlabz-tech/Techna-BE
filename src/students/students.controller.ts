import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../enums/role.enum';
import { RolesGuard } from '../auth/roles.guard';
import { RejectStudentDto } from './dto/reject-student.dto';
import { StudentsService } from './students.service';
import type {
  CreateStudentPayload,
  UpdateStudentPayload,
} from './students.service';

interface AuthenticatedRequest {
  user: {
    role: Role;
    userId: string;
  };
}

@Controller('students')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  // ─── GET all students (ADMIN only) ─────────────────────────────
  @Get()
  @Roles(Role.ADMIN)
  findAll() {
    return this.studentsService.findAll();
  }

  // ─── GET student by ID (admin or own profile) ──────────────────
  @Get(':id')
  @Roles(Role.ADMIN, Role.STUDENT)
  async findOne(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    if (req.user.role === Role.STUDENT && req.user.userId !== id) {
      throw new ForbiddenException('You can only view your own profile');
    }

    return this.studentsService.findOne(id);
  }

  // ─── CREATE student (ADMIN only) ────────────────────────────────
  @Post()
  @Roles(Role.ADMIN)
  create(@Body() body: CreateStudentPayload) {
    return this.studentsService.create(body);
  }

  // ─── UPDATE student (ADMIN only) ────────────────────────────────
  @Patch(':id')
  @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() body: UpdateStudentPayload) {
    return this.studentsService.update(id, body);
  }

  // ─── DELETE student (ADMIN only) ────────────────────────────────
  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.studentsService.remove(id);
  }

  // ─── APPROVE student (ADMIN only) ───────────────────────────────
  @Patch(':id/approve')
  @Roles(Role.ADMIN)
  approveStudent(@Param('id') id: string) {
    return this.studentsService.approveStudent(id);
  }

  // ─── REJECT student (ADMIN only) ────────────────────────────────
  @Patch(':id/reject')
  @Roles(Role.ADMIN)
  rejectStudent(
    @Param('id') id: string,
    @Body() rejectStudentDto: RejectStudentDto,
  ) {
    return this.studentsService.rejectStudent(id, rejectStudentDto);
  }

  // ─── GENERATE QR CODE (ADMIN only) ──────────────────────────────
  @Post(':studentId/qr-code')
  @Roles(Role.ADMIN)
  generateStudentQrCode(@Param('studentId') studentId: string) {
    return this.studentsService.generateStudentQrCode(studentId);
  }
}
