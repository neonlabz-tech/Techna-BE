import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
  Headers,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../enums/role.enum';
import { Public } from './public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // ─── POST /auth/login ───────────────────────────────────────────────────────
  @Post('login')
  @Public()
  @ApiBody({
    schema: {
      type: 'object',
      required: ['email', 'password'],
      properties: {
        email: { type: 'string', example: 'admin@techna.com' },
        password: { type: 'string', example: 'Admin@1234' },
      },
    },
  })
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password);
  }

  // ─── POST /auth/student/login  (student-specific login) ─────────────────────
  @Post('student/login')
  @Public()
  @ApiBody({
    schema: {
      type: 'object',
      required: ['email', 'password'],
      properties: {
        email: { type: 'string', example: 'student@example.com' },
        password: { type: 'string', example: 'password123' },
      },
    },
  })
  @HttpCode(HttpStatus.OK)
  async studentLogin(@Body() body: { email: string; password: string }) {
    return this.authService.studentLogin(body.email, body.password);
  }

  // ─── POST /auth/logout  (any authenticated user) ─────────────────────────────
  @Post('logout')
  @ApiBearerAuth('access-token')
  @ApiUnauthorizedResponse({ description: 'Missing, invalid, or expired JWT' })
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async logout(@Headers('authorization') authHeader: string) {
    const token = authHeader?.replace('Bearer ', '');
    return this.authService.logout(token);
  }

  // ─── GET /auth/session  (returns current logged-in user info) ────────────────
  @Get('session')
  @ApiBearerAuth('access-token')
  @ApiUnauthorizedResponse({ description: 'Missing, invalid, or expired JWT' })
  @UseGuards(JwtAuthGuard)
  async getSession(@Request() req: any) {
    return this.authService.getSession(req.user);
  }

  // ─── GET /auth/profile  (any authenticated user) ───────────────────────────
  @Get('profile')
  @ApiBearerAuth('access-token')
  @ApiUnauthorizedResponse({ description: 'Missing, invalid, or expired JWT' })
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req: any) {
    return { message: 'Authenticated', user: req.user };
  }

  // ─── GET /auth/admin  (admin only) ─────────────────────────────────────────
  @Get('admin')
  @ApiBearerAuth('access-token')
  @ApiUnauthorizedResponse({ description: 'Missing, invalid, or expired JWT' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  adminOnly() {
    return { message: 'Welcome, Admin!' };
  }

  // ─── GET /auth/teacher  (admin + teacher) ───────────────────────────────────
  @Get('teacher')
  @ApiBearerAuth('access-token')
  @ApiUnauthorizedResponse({ description: 'Missing, invalid, or expired JWT' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.TEACHER)
  teacherOnly() {
    return { message: 'Welcome, Teacher!' };
  }

  // ─── GET /auth/student  (admin + student) ───────────────────────────────────
  @Get('student')
  @ApiBearerAuth('access-token')
  @ApiUnauthorizedResponse({ description: 'Missing, invalid, or expired JWT' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.STUDENT)
  studentOnly() {
    return { message: 'Welcome, Student!' };
  }

  // ─── POST /auth/forgot-password  (public) ────────────────────────────────────
  @Post('forgot-password')
  @Public()
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() body: { email: string }) {
    await this.authService.forgotPassword(body.email);
    return { message: 'If that email is registered, a reset code has been sent.' };
  }

  // ─── POST /auth/reset-password  (public) ─────────────────────────────────────
  @Post('reset-password')
  @Public()
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() body: { token: string; newPassword: string }) {
    return this.authService.resetPassword(body.token, body.newPassword);
  }
}
