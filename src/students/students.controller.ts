import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../enums/role.enum';
import { RolesGuard } from '../auth/roles.guard';
import { RegisterStudentDto } from './dto/register-student.dto';
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

/**
 * NOTE: This controller does NOT apply @UseGuards at the class level.
 * Guards are applied per-route so that public endpoints (register) can
 * coexist with protected endpoints in the same controller.
 */
@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  // ─── PUBLIC: Submit registration form ────────────────────────────────────
  // No JWT required. Anyone can submit a registration.
  // Creates a student record with status: 'pending'.
  // The student cannot log in until an admin approves.
  //
  // POST /students/register
  // Body: RegisterStudentDto
  @Post('register')
  register(@Body() dto: RegisterStudentDto) {
    return this.studentsService.registerStudent(dto);
  }

  // ─── ADMIN: Get all students (with optional status filter) ────────────────
  //
  // GET /students
  // GET /students?status=pending
  // GET /students?status=approved
  // GET /students?status=rejected
  @Get()
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  findAll(@Query('status') status?: 'pending' | 'approved' | 'rejected') {
    return this.studentsService.findAll(status);
  }

  // ─── ADMIN or own STUDENT: Get student profile ────────────────────────────
  //
  // GET /students/:id
  @Get(':id')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.STUDENT)
  async findOne(
    @Param('id') id: string,
    @Request() req: AuthenticatedRequest,
  ) {
    if (req.user.role === Role.STUDENT && req.user.userId !== id) {
      throw new ForbiddenException('You can only view your own profile');
    }

    return this.studentsService.findOne(id);
  }

  // ─── ADMIN or own STUDENT: Enrolment history ─────────────────────────────
  // Returns the full enrolment record for a student.
  // Students may only request their own history.
  // Admins may request any student's history.
  //
  // GET /students/:id/enrolment-history
  @Get(':id/enrolment-history')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.STUDENT)
  getEnrolmentHistory(
    @Param('id') id: string,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.studentsService.getEnrolmentHistory(
      id,
      req.user.userId,
      req.user.role,
    );
  }

  // ─── ADMIN: Create student directly ──────────────────────────────────────
  //
  // POST /students
  @Post()
  @ApiBearerAuth('access-token')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['name', 'email', 'phone', 'batch'],
      properties: {
        name: { type: 'string', example: 'Kasun Perera' },
        email: { type: 'string', example: 'kasun.perera@example.com' },
        phone: { type: 'string', example: '0771234567' },
        batch: { type: 'string', example: '2026 A/L' },
        modules: {
          type: 'array',
          items: { type: 'string' },
          example: ['Advanced ICT'],
        },
        address: { type: 'string', example: 'No. 20, Lake Road, Kandy' },
        dob: { type: 'string', example: '2008-05-20' },
        avatar: { type: 'string', example: 'https://example.com/avatar.jpg' },
        parentName: { type: 'string', example: 'Nimal Perera' },
        parentPhone: { type: 'string', example: '0712345678' },
      },
    },
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  create(@Body() body: CreateStudentPayload) {
    return this.studentsService.create(body);
  }

  // ─── ADMIN: Update student ────────────────────────────────────────────────
  //
  // PATCH /students/:id
  @Patch(':id')
  @ApiBearerAuth('access-token')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Kasun Perera' },
        email: { type: 'string', example: 'kasun.perera@example.com' },
        phone: { type: 'string', example: '0771234567' },
        batch: { type: 'string', example: '2026 A/L' },
        modules: {
          type: 'array',
          items: { type: 'string' },
          example: ['Advanced ICT'],
        },
        address: { type: 'string', example: 'No. 20, Lake Road, Kandy' },
        dob: { type: 'string', example: '2008-05-20' },
        avatar: { type: 'string', example: 'https://example.com/avatar.jpg' },
        parentName: { type: 'string', example: 'Nimal Perera' },
        parentPhone: { type: 'string', example: '0712345678' },
      },
    },
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() body: UpdateStudentPayload) {
    return this.studentsService.update(id, body);
  }

  // ─── ADMIN: Delete student ────────────────────────────────────────────────
  //
  // DELETE /students/:id
  @Delete(':id')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.studentsService.remove(id);
  }

  // ─── ADMIN: Approve registration ─────────────────────────────────────────
  // Sets status → 'approved', records approvedAt, generates QR code.
  //
  // PATCH /students/:id/approve
  @Patch(':id/approve')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  approveStudent(@Param('id') id: string) {
    return this.studentsService.approveStudent(id);
  }

  // ─── ADMIN: Reject registration ───────────────────────────────────────────
  // Sets status → 'rejected', stores reason, sends rejection email.
  //
  // PATCH /students/:id/reject
  // Body: { reason: string }
  @Patch(':id/reject')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  rejectStudent(
    @Param('id') id: string,
    @Body() rejectStudentDto: RejectStudentDto,
  ) {
    return this.studentsService.rejectStudent(id, rejectStudentDto);
  }

  // ─── ADMIN: Generate QR code ──────────────────────────────────────────────
  //
  // POST /students/:studentId/qr-code
  @Post(':studentId/qr-code')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  generateStudentQrCode(@Param('studentId') studentId: string) {
    return this.studentsService.generateStudentQrCode(studentId);
  }
}
