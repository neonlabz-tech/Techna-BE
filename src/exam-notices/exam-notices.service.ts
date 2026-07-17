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
import { Student } from '../students/schemas/student.schema';
import {
  Result,
  ResultDocument,
} from '../results/schemas/result.schema';
import { getExamTypeDescription } from '../results/exam-types';

@Injectable()
export class ExamNoticesService {
  constructor(
    @InjectModel(ExamNotice.name)
    private readonly examNoticeModel: Model<ExamNoticeDocument>,
    private readonly notificationsService: NotificationsService,

    @InjectModel(Student.name)
    private readonly studentModel: Model<any>,

    @InjectModel(Result.name)
    private readonly resultModel: Model<ResultDocument>,
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

  async getResultsByStudentId(studentId: string) {
    const student = await this.studentModel
      .findOne({ studentId })
      .select('-password')
      .lean();

    if (!student) {
      throw new NotFoundException(`Student with ID ${studentId} not found`);
    }

    const studentModules: string[] = student.subjects?.length
      ? student.subjects
      : student.modules ?? [];

    // Exam schedule
    const rawSchedule = await this.examNoticeModel
      .find({
        $or: [
          { moduleName: { $in: studentModules } },
          { batch: student.batch },
        ],
      })
      .sort({ date: -1 })
      .lean();

    // Published results from results collection (marks + grades)
    const resultDocs = await this.resultModel
      .find({ studentId })
      .sort({ createdAt: -1 })
      .lean();

    // Flatten per-module results across all result documents
    const allModuleResults = resultDocs.flatMap((doc) =>
      (doc.modules || []).map((m) => ({
        moduleName: m.moduleName,
        examType: m.examType as string,
        examTypeDescription: getExamTypeDescription(m.examType as string),
        marks: m.marks,
        grade: m.grade as string,
        result: (m.grade !== 'F' ? 'pass' : 'fail') as string,
      })),
    );

    // Cast schedule array for flexible field access (ExamNotice has no examType/semester)
    const schedule = rawSchedule as unknown as Array<Record<string, unknown>>;

    // Track which allModuleResults indices have been consumed so each result
    // is matched to at most one schedule entry (prevents duplicates when the
    // exam schedule has multiple notices for the same module name).
    const usedIndices = new Set<number>();

    const enrichedSchedule = schedule.map((exam) => {
      const examModuleLower = (exam.moduleName as string || '').toLowerCase();
      const matchIdx = allModuleResults.findIndex(
        (r, i) =>
          !usedIndices.has(i) &&
          r.moduleName.toLowerCase() === examModuleLower,
      );
      const matched = matchIdx >= 0 ? allModuleResults[matchIdx] : undefined;
      if (matchIdx >= 0) usedIndices.add(matchIdx);
            return {
        _id: exam._id,
        title: exam.title,
        moduleName: exam.moduleName,
        examType: matched?.examType ?? null,
        examTypeDescription: matched?.examTypeDescription ?? null,
        date: exam.date,
        venue: exam.venue,
        startTime: exam.startTime,
        endTime: exam.endTime,
        batch: exam.batch,
        semester: exam.semester ?? null,
        marks: matched?.marks ?? null,
        maxMarks: 100,
        grade: matched?.grade ?? null,
        result: matched?.result ?? null,
        hasResult: !!matched,
      };
    });

    // Standalone results: indices not consumed by schedule matching above
    const standaloneResults = allModuleResults
      .filter((_, i) => !usedIndices.has(i))
      .map((r) => ({
        _id: null,
        title: r.examType,
        moduleName: r.moduleName,
        examType: r.examType,
        examTypeDescription: r.examTypeDescription,
        date: null,
        venue: null,
        startTime: null,
        endTime: null,
        batch: student.batch,
        semester: null,
        marks: r.marks,
        maxMarks: 100,
        grade: r.grade,
        result: r.result,
        hasResult: true,
      }));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const allResults: any[] = [...enrichedSchedule, ...standaloneResults];
    const resultsWithMarks = allResults.filter((r) => r.hasResult);

    // Final dedup: composite key catches any remaining edge cases
    const seenKeys = new Set<string>();
    const deduped = resultsWithMarks.filter((r) => {
      const key = `${String(r.moduleName).toLowerCase()}|${String(r.examType)}|${String(r.marks)}`;
      if (seenKeys.has(key)) return false;
      seenKeys.add(key);
      return true;
    });

    const avgScore =
      deduped.length > 0
        ? Math.round(
            deduped.reduce((sum: number, r) => sum + (r.marks ?? 0), 0) /
              deduped.length,
          )
        : 0;
    const passed = deduped.filter((r) => r.result === 'pass').length;
    const failed = deduped.filter((r) => r.result === 'fail').length;

    return {
      student: {
        studentId: student.studentId,
        fullNameEnglish: student.fullNameEnglish,
        email: student.email,
        admissionNumber: student.admissionNumber,
        nicNo: student.nicNo,
        whatsappNo: student.whatsappNo,
        batch: student.batch,
        modules: studentModules,
      },
      results: deduped,
      summary: {
        totalResults: deduped.length,
        passed,
        failed,
        averageScore: avgScore,
      },
    };
  }
}
