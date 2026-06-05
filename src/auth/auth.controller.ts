import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../enums/role.enum';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // ─── POST /auth/login ───────────────────────────────────────────────────────
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password);
  }

  // ─── GET /auth/profile  (any authenticated user) ───────────────────────────
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req: any) {
    return { message: 'Authenticated', user: req.user };
  }

  // ─── GET /auth/admin  (admin only) ─────────────────────────────────────────
  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  adminOnly() {
    return { message: 'Welcome, Admin!' };
  }

  // ─── GET /auth/teacher  (admin + teacher) ───────────────────────────────────
  @Get('teacher')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.TEACHER)
  teacherOnly() {
    return { message: 'Welcome, Teacher!' };
  }

  // ─── GET /auth/student  (admin + student) ───────────────────────────────────
  @Get('student')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.STUDENT)
  studentOnly() {
    return { message: 'Welcome, Student!' };
  }
}
