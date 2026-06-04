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
import { TeachersService } from './teachers.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../enums/role.enum';

@Controller('teachers')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  // ─── GET /api/teachers  (admin only) ───────────────────────────────────────
  @Get()
  @Roles(Role.ADMIN)
  findAll() {
    return this.teachersService.findAll();
  }

  // ─── GET /api/teachers/:id  (admin sees any; teacher sees own profile) ──────
  @Get(':id')
  @Roles(Role.ADMIN, Role.TEACHER)
  async findOne(@Param('id') id: string, @Request() req: any) {
    if (req.user.role === Role.TEACHER && req.user.userId !== id) {
      throw new ForbiddenException('You can only view your own profile');
    }
    return this.teachersService.findOne(id);
  }

  // ─── POST /api/teachers  (admin only) ──────────────────────────────────────
  @Post()
  @Roles(Role.ADMIN)
  create(@Body() body: any) {
    return this.teachersService.create(body);
  }

  // ─── PATCH /api/teachers/:id  (admin only) ─────────────────────────────────
  @Patch(':id')
  @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() body: any) {
    return this.teachersService.update(id, body);
  }

  // ─── DELETE /api/teachers/:id  (admin only) ────────────────────────────────
  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.teachersService.remove(id);
  }
}
