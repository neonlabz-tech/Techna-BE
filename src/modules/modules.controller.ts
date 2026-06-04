import {
<<<<<<< HEAD
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
=======
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';

import { ModulesService } from './modules.service';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';

@Controller('modules')
export class ModulesController {
  constructor(private readonly modulesService: ModulesService) {}

  @Post()
  create(@Body() createModuleDto: CreateModuleDto) {
    return this.modulesService.create(createModuleDto);
  }

  @Get()
>>>>>>> 4865900d3a2737a902004f0d5bf511c165efc7ee
  findAll() {
    return this.modulesService.findAll();
  }

<<<<<<< HEAD
  // ─── GET /api/modules/:id  (admin + teacher + student) ─────────────────────
  @Get(':id')
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
=======
  @Get(':id')
>>>>>>> 4865900d3a2737a902004f0d5bf511c165efc7ee
  findOne(@Param('id') id: string) {
    return this.modulesService.findOne(id);
  }

<<<<<<< HEAD
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
=======
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateModuleDto: UpdateModuleDto,
  ) {
    return this.modulesService.update(id, updateModuleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.modulesService.remove(id);
  }
}
>>>>>>> 4865900d3a2737a902004f0d5bf511c165efc7ee
