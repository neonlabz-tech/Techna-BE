import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateExamNoticeDto } from './dto/create-exam-notice.dto';
import { UpdateExamNoticeDto } from './dto/update-exam-notice.dto';
import {
  ExamNotice,
  ExamNoticeDocument,
} from './schemas/exam-notice.schema';

@Injectable()
export class ExamNoticesService {
  constructor(
    @InjectModel(ExamNotice.name)
    private readonly examNoticeModel: Model<ExamNoticeDocument>,
  ) {}

  async create(createExamNoticeDto: CreateExamNoticeDto) {
    const payload: CreateExamNoticeDto & { publishedAt?: Date } = {
      ...createExamNoticeDto,
      isPublished: createExamNoticeDto.isPublished ?? false,
      publishedAt: createExamNoticeDto.isPublished ? new Date() : undefined,
    };

    const examNotice = new this.examNoticeModel(payload);
    return examNotice.save();
  }

  async findAll() {
    return this.examNoticeModel
      .find()
      .sort({ isPublished: -1, date: 1, createdAt: -1 });
  }

  async findPublished() {
    return this.examNoticeModel
      .find({ isPublished: true })
      .sort({ date: 1, createdAt: -1 });
  }

  async findOne(id: string) {
    const examNotice = await this.examNoticeModel.findById(id);

    if (!examNotice) {
      throw new NotFoundException('Exam notice not found');
    }

    return examNotice;
  }

  async update(id: string, updateExamNoticeDto: UpdateExamNoticeDto) {
    const updatePayload: UpdateExamNoticeDto & { publishedAt?: Date | null } = {
      ...updateExamNoticeDto,
    };

    if (typeof updateExamNoticeDto.isPublished === 'boolean') {
      updatePayload.publishedAt = updateExamNoticeDto.isPublished
        ? new Date()
        : null;
    }

    const updatedExamNotice = await this.examNoticeModel.findByIdAndUpdate(
      id,
      updatePayload,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedExamNotice) {
      throw new NotFoundException('Exam notice not found');
    }

    return updatedExamNotice;
  }

  async publish(id: string) {
    const examNotice = await this.examNoticeModel.findByIdAndUpdate(
      id,
      {
        isPublished: true,
        publishedAt: new Date(),
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!examNotice) {
      throw new NotFoundException('Exam notice not found');
    }

    return examNotice;
  }

  async unpublish(id: string) {
    const examNotice = await this.examNoticeModel.findByIdAndUpdate(
      id,
      {
        isPublished: false,
        publishedAt: null,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!examNotice) {
      throw new NotFoundException('Exam notice not found');
    }

    return examNotice;
  }

  async remove(id: string) {
    const deletedExamNotice = await this.examNoticeModel.findByIdAndDelete(id);

    if (!deletedExamNotice) {
      throw new NotFoundException('Exam notice not found');
    }

    return {
      message: 'Exam notice deleted successfully',
    };
  }
}