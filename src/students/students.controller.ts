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

  // ─── GET /api/students  (admin only) ───────────────────────────────────────
  @Get()
  @Roles(Role.ADMIN)
  findAll() {
    return this.studentsService.findAll();
  }

  // ─── GET /api/students/:id  (admin sees any; student sees own profile) ──────
  @Get(':id')
  @Roles(Role.ADMIN, Role.STUDENT)
  async findOne(@Param('id') id: string, @Request() req: any) {
    if (req.user.role === Role.STUDENT && req.user.userId !== id) {
      throw new ForbiddenException('You can only view your own profile');
    }
    return this.studentsService.findOne(id);
  }

  // ─── POST /api/students  (admin only) ──────────────────────────────────────
  @Post()
  @Roles(Role.ADMIN)
  create(@Body() body: any) {
    return this.studentsService.create(body);
  }

  // ─── PATCH /api/students/:id  (admin only) ─────────────────────────────────
  @Patch(':id')
  @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() body: any) {
    return this.studentsService.update(id, body);
  }

  // ─── DELETE /api/students/:id  (admin only) ────────────────────────────────
  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.studentsService.remove(id);
  }
}
