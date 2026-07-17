/// <reference types="multer" />
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import type { Multer } from 'multer';
import { ModulesService } from './modules.service';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import { AddResourceUrlDto } from './dto/add-resource-url.dto';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../enums/role.enum';
import { Public } from '../auth/public.decorator';

@Controller('modules')
@ApiBearerAuth('access-token')
//@UseGuards(JwtAuthGuard, RolesGuard)
export class ModulesController {
  constructor(private readonly modulesService: ModulesService) {}

  @Post()
 // @Roles(Role.ADMIN)
  create(@Body() createModuleDto: CreateModuleDto) {
    return this.modulesService.create(createModuleDto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  findAll(@Query('status') status?: string) {
    return this.modulesService.findAll(status);
  }

  @Get('public')
  @Public()
  findPublished() {
    return this.modulesService.findPublished();
  }

  @Get(':id')
 // @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  findOne(@Param('id') id: string) {
    return this.modulesService.findOne(id);
  }

  @Patch(':id')
 //@Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() updateModuleDto: UpdateModuleDto) {
    return this.modulesService.update(id, updateModuleDto);
  }

  @Delete(':id')
 // @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.modulesService.remove(id);
  }

  @Post(':id/upload-resource')
  @Roles(Role.ADMIN)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file', 'title'],
      properties: {
        file: { type: 'string', format: 'binary' },
        title: { type: 'string', example: 'Lecture 01 notes' },
      },
    },
  })

 // @Roles(Role.ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  uploadResource(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body('title') title: string,
  ) {
    return this.modulesService.uploadResource(id, file, title);
  }

  @Post('sync-r2')
  @Roles(Role.ADMIN)
  syncResourcesWithR2() {
    return this.modulesService.syncResourcesWithR2();
  }

  @Post(':id/add-resource-url')
  @Roles(Role.ADMIN)
  addResourceUrl(
    @Param('id') id: string,
    @Body() addResourceUrlDto: AddResourceUrlDto,
  ) {
    return this.modulesService.addResourceUrl(id, addResourceUrlDto);
  }

  @Delete(':moduleId/resources/:resourceId')
  //@Roles(Role.ADMIN)
  deleteResource(
    @Param('moduleId') moduleId: string,
    @Param('resourceId') resourceId: string,
  ) {
    return this.modulesService.deleteResource(moduleId, resourceId);
  }

  @Patch(':moduleId/resources/:resourceId')
  @Roles(Role.ADMIN)
  @ApiBody({
    schema: {
      type: 'object',
      required: ['title'],
      properties: {
        title: { type: 'string', example: 'Updated lecture notes' },
      },
    },
  })

 // @Roles(Role.ADMIN)
    updateResource(
    @Param('moduleId') moduleId: string,
    @Param('resourceId') resourceId: string,
    @Body('title') title: string,
  ) {
    return this.modulesService.updateResource(moduleId, resourceId, title);
  }

  @Patch(':moduleId/resources/:resourceId/toggle-publish')
  @Roles(Role.ADMIN)
  togglePublish(
    @Param('moduleId') moduleId: string,
    @Param('resourceId') resourceId: string,
  ) {
    return this.modulesService.toggleResourcePublish(moduleId, resourceId);
  }
}
