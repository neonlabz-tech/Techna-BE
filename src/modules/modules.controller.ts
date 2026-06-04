import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ModulesService } from './modules.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../enums/role.enum';

@Controller('modules')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ModulesController {
  constructor(private readonly modulesService: ModulesService) {}

  // ─── GET /api/modules  (admin + teacher + student) ─────────────────────────
  @Get()
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  findAll() {
    return this.modulesService.findAll();
  }

  // ─── GET /api/modules/:id  (admin + teacher + student) ─────────────────────
  @Get(':id')
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  findOne(@Param('id') id: string) {
    return this.modulesService.findOne(id);
  }

  // ─── POST /api/modules  (admin only) ───────────────────────────────────────
  @Post()
  @Roles(Role.ADMIN)
  create(@Body() body: any) {
    return this.modulesService.create(body);
  }

  // ─── PATCH /api/modules/:id  (admin only) ──────────────────────────────────
  @Patch(':id')
  @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() body: any) {
    return this.modulesService.update(id, body);
  }

  // ─── DELETE /api/modules/:id  (admin only) ─────────────────────────────────
  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.modulesService.remove(id);
  }
}
