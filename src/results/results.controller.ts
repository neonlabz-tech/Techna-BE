import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateResultDto } from './dto/create-result.dto';
import { UpdateResultDto } from './dto/update-result.dto';
import { ResultsService } from './results.service';

@Controller('results')
export class ResultsController {
  constructor(private readonly resultsService: ResultsService) {}

  @Post()
  create(@Body() dto: CreateResultDto) {
    return this.resultsService.create(dto);
  }

  @Get()
  findAll() {
    return this.resultsService.findAll();
  }

  @Get('student/:studentId')
  findByStudentId(@Param('studentId') studentId: string) {
    return this.resultsService.findByStudentId(studentId);
  }

  @Get('student/:studentId/modules')
  getStudentModules(@Param('studentId') studentId: string) {
    return this.resultsService.getStudentEnrolledModules(studentId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.resultsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateResultDto) {
    return this.resultsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.resultsService.remove(id);
  }
}