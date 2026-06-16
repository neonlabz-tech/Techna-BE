import {
  BadRequestException,
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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

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

@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post('register')
  @UseInterceptors(FileInterceptor('profilePhoto'))
  async register(
    @Body('payload') payload: string,
    @UploadedFile() profilePhoto?: Express.Multer.File,
  ) {
    if (!payload) {
      throw new BadRequestException('Registration payload is required');
    }

    let parsedPayload: unknown;

    try {
      parsedPayload = JSON.parse(payload);
    } catch {
      throw new BadRequestException('Invalid registration payload');
    }

    const dto = plainToInstance(RegisterStudentDto, parsedPayload);
    const validationErrors = await validate(dto, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    if (validationErrors.length > 0) {
      throw new BadRequestException(validationErrors);
    }

    return this.studentsService.registerStudent(dto, profilePhoto);
  }

  @Get()
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  findAll(@Query('status') status?: 'pending' | 'approved' | 'rejected') {
    return this.studentsService.findAll(status);
  }

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
        batch: { type: 'string', example: '2026 Batch' },
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

  @Delete(':id')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.studentsService.remove(id);
  }

  @Patch(':id/approve')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  approveStudent(@Param('id') id: string) {
    return this.studentsService.approveStudent(id);
  }

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

  @Post(':studentId/qr-code')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  generateStudentQrCode(@Param('studentId') studentId: string) {
    return this.studentsService.generateStudentQrCode(studentId);
  }
}