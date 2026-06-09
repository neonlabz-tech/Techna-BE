import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { CreateExamNoticeDto } from './dto/create-exam-notice.dto';
import { UpdateExamNoticeDto } from './dto/update-exam-notice.dto';
import { ExamNoticesService } from './exam-notices.service';

@Controller('exam-notices')
export class ExamNoticesController {
  constructor(private readonly examNoticesService: ExamNoticesService) {}

  @Post()
  create(@Body() createExamNoticeDto: CreateExamNoticeDto) {
    return this.examNoticesService.create(createExamNoticeDto);
  }

  @Get()
  findAll() {
    return this.examNoticesService.findAll();
  }

  @Get('public')
  findPublished() {
    return this.examNoticesService.findPublished();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.examNoticesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateExamNoticeDto: UpdateExamNoticeDto,
  ) {
    return this.examNoticesService.update(id, updateExamNoticeDto);
  }

  @Patch(':id/publish')
  publish(@Param('id') id: string) {
    return this.examNoticesService.publish(id);
  }

  @Patch(':id/unpublish')
  unpublish(@Param('id') id: string) {
    return this.examNoticesService.unpublish(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.examNoticesService.remove(id);
  }
}