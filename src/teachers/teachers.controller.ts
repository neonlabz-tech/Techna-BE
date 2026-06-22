import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { Public } from '../auth/public.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth } from '@nestjs/swagger';
import { TeachersService } from './teachers.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../enums/role.enum';

@Controller('teachers')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  // ─── GET /api/teachers  (admin only) ───────────────────────────────────────
  @Get()
  @Roles(Role.ADMIN)
  findAll() {
    return this.teachersService.findAll();
  }

  // ─── GET /api/teachers/:id  (public — used by website teacher profile page) ──
  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
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

  // ─── POST /api/teachers/:id/upload-photo  (admin only) ─────────────────────
  @Post(':id/upload-photo')
  @Roles(Role.ADMIN)
  @UseInterceptors(FileInterceptor('photo'))
  uploadPhoto(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.teachersService.uploadPhoto(id, file);
  }

  // ─── DELETE /api/teachers/:id/photo  (admin only) ──────────────────────────
  @Delete(':id/photo')
  @Roles(Role.ADMIN)
  removePhoto(@Param('id') id: string) {
    return this.teachersService.removePhoto(id);
  }
}
