import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  ForbiddenException,
} from '@nestjs/common';

import { StudentsService } from './students.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../enums/role.enum';

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
  async findOne(@Param('id') id: string, @Request() req: any) {
    if (req.user.role === Role.STUDENT && req.user.userId !== id) {
      throw new ForbiddenException('You can only view your own profile');
    }

    return this.studentsService.findOne(id);
  }

  // ─── CREATE student (ADMIN only) ────────────────────────────────
  @Post()
  @Roles(Role.ADMIN)
  create(@Body() body: any) {
    return this.studentsService.create(body);
  }

  // ─── UPDATE student (ADMIN only) ────────────────────────────────
  @Patch(':id')
  @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() body: any) {
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

  // ─── GENERATE QR CODE (ADMIN only) ──────────────────────────────
  @Post(':studentId/qr-code')
  @Roles(Role.ADMIN)
  generateStudentQrCode(@Param('studentId') studentId: string) {
    return this.studentsService.generateStudentQrCode(studentId);
  }
}