import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateExamNoticeDto } from './dto/create-exam-notice.dto';
import { UpdateExamNoticeDto } from './dto/update-exam-notice.dto';
import {
  ExamNotice,
  ExamNoticeDocument,
} from './schemas/exam-notice.schema';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class ExamNoticesService {
  constructor(
    @InjectModel(ExamNotice.name)
    private readonly examNoticeModel: Model<ExamNoticeDocument>,
    private readonly notificationsService: NotificationsService,
  ) {}

  async create(createExamNoticeDto: CreateExamNoticeDto) {
    const payload: CreateExamNoticeDto & { publishedAt?: Date } = {
      ...createExamNoticeDto,
      isPublished: createExamNoticeDto.isPublished ?? false,
      publishedAt: createExamNoticeDto.isPublished ? new Date() : undefined,
    };

    const examNotice = new this.examNoticeModel(payload);
    const saved = await examNotice.save();

    // Auto-send notification when exam notice is published on creation
    if (saved.isPublished) {
      void this.notificationsService.notifyExamNotice({
        _id: saved._id?.toString(),
        title: saved.title,
        moduleName: saved.moduleName,
        moduleId: saved.moduleId,
        batch: saved.batch,
        date: saved.date,
        startTime: saved.startTime,
        endTime: saved.endTime,
        venue: saved.venue,
      });
    }

    return saved;
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
    // Check current state before update to detect publish transition
    const existing = await this.examNoticeModel.findById(id).lean();

    if (!existing) {
      throw new NotFoundException('Exam notice not found');
    }

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

    // Auto-send notification when exam notice transitions from unpublished to published
    if (!existing.isPublished && updatedExamNotice.isPublished) {
      void this.notificationsService.notifyExamNotice({
        _id: updatedExamNotice._id?.toString(),
        title: updatedExamNotice.title,
        moduleName: updatedExamNotice.moduleName,
        moduleId: updatedExamNotice.moduleId,
        batch: updatedExamNotice.batch,
        date: updatedExamNotice.date,
        startTime: updatedExamNotice.startTime,
        endTime: updatedExamNotice.endTime,
        venue: updatedExamNotice.venue,
      });
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

    // Send notification to students
    void this.notificationsService.notifyExamNotice({
      _id: examNotice._id?.toString(),
      title: examNotice.title,
      moduleName: examNotice.moduleName,
      moduleId: examNotice.moduleId,
      batch: examNotice.batch,
      date: examNotice.date,
      startTime: examNotice.startTime,
      endTime: examNotice.endTime,
      venue: examNotice.venue,
    });

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