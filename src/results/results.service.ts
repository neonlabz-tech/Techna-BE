import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { CreateResultDto } from './dto/create-result.dto';
import { UpdateResultDto } from './dto/update-result.dto';
import { Result, ResultDocument } from './schemas/result.schema';
import { getExamTypeDescription } from './exam-types';
import {
  Student,
  StudentDocument,
} from '../students/schemas/student.schema';

type ResultModuleResponse = object & {
  examType?: string;
};

type ResultResponse = {
  modules?: ResultModuleResponse[];
};

@Injectable()
export class ResultsService {
  constructor(
    @InjectModel(Result.name)
    private readonly resultModel: Model<ResultDocument>,

    @InjectModel(Student.name)
    private readonly studentModel: Model<StudentDocument>,
  ) {}

  async create(dto: CreateResultDto) {
    const student = await this.studentModel
      .findOne({ studentId: dto.studentId })
      .lean();

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    const enrolledModules = this.getStudentModules(student);

    if (enrolledModules.length === 0) {
      throw new BadRequestException('Student has no enrolled modules');
    }

    const modules = dto.modules.map((module) => {
      const isEnrolled = enrolledModules.some(
        (item) =>
          item.toLowerCase() ===
          module.moduleName.trim().toLowerCase(),
      );

      if (!isEnrolled) {
        throw new BadRequestException(
          `${module.moduleName} is not enrolled by this student`,
        );
      }

      return {
        moduleName: module.moduleName.trim(),
        examType: module.examType,
        marks: module.marks,
        grade: this.calculateGrade(module.marks),
      };
    });

    const result = await this.resultModel.create({
      studentId: student.studentId,
      studentName:
        student.fullNameEnglish ||
        student.email ||
        'Student',
      batch: student.batch || '',
      date: dto.date ? new Date(dto.date) : new Date(),
      modules,
    });

    return this.withExamTypeDescriptions(result.toObject());
  }

  async findAll() {
    const results = await this.resultModel
      .find()
      .sort({ createdAt: -1 })
      .lean();

    return results.map((result) =>
      this.withExamTypeDescriptions(result),
    );
  }

  async findOne(id: string) {
    const result = await this.resultModel.findById(id).lean();

    if (!result) {
      throw new NotFoundException('Result not found');
    }

    return this.withExamTypeDescriptions(result);
  }

  async findByStudentId(studentId: string) {
    const results = await this.resultModel
      .find({ studentId })
      .sort({ createdAt: -1 })
      .lean();

    return results.map((result) =>
      this.withExamTypeDescriptions(result),
    );
  }

  async update(id: string, dto: UpdateResultDto) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid result id');
    }

    const existing = await this.resultModel.findById(id);

    if (!existing) {
      throw new NotFoundException('Result not found');
    }

    let studentId = existing.studentId;

    if (dto.studentId) {
      studentId = dto.studentId;
    }

    const student = await this.studentModel
      .findOne({ studentId })
      .lean();

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    const updatePayload: Record<string, unknown> = {};

    if (dto.studentId) {
      updatePayload.studentId = student.studentId;
      updatePayload.studentName =
        student.fullNameEnglish ||
        student.email ||
        'Student';
      updatePayload.batch = student.batch || '';
    }

    if (dto.modules) {
      const enrolledModules = this.getStudentModules(student);

      updatePayload.modules = dto.modules.map((module) => {
        const isEnrolled = enrolledModules.some(
          (item) =>
            item.toLowerCase() ===
            module.moduleName.trim().toLowerCase(),
        );

        if (!isEnrolled) {
          throw new BadRequestException(
            `${module.moduleName} is not enrolled by this student`,
          );
        }

        return {
          moduleName: module.moduleName.trim(),
          examType: module.examType,
          marks: module.marks,
          grade: this.calculateGrade(module.marks),
        };
      });
    }

    const updated = await this.resultModel
      .findByIdAndUpdate(id, updatePayload, {
        new: true,
        runValidators: true,
      })
      .lean();

    return updated
      ? this.withExamTypeDescriptions(updated)
      : updated;
  }

  async remove(id: string) {
    const deleted = await this.resultModel
      .findByIdAndDelete(id)
      .lean();

    if (!deleted) {
      throw new NotFoundException('Result not found');
    }

    return {
      message: 'Result deleted successfully',
    };
  }

  async getStudentEnrolledModules(studentId: string) {
    const student = await this.studentModel
      .findOne({ studentId })
      .lean();

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    return {
      studentId: student.studentId,
      studentName:
        student.fullNameEnglish ||
        student.email ||
        'Student',
      batch: student.batch || '',
      modules: this.getStudentModules(student),
    };
  }

  private calculateGrade(
    marks: number,
  ): 'A' | 'B' | 'C' | 'F' {
    if (marks < 0 || marks > 100) {
      throw new BadRequestException(
        'Marks must be between 0 and 100',
      );
    }

    if (marks >= 75) return 'A';
    if (marks >= 65) return 'B';
    if (marks >= 35) return 'C';

    return 'F';
  }

  private getStudentModules(student: any): string[] {
    const modules = [
      ...(student.subjects || []),
      ...(student.modules || []),
      ...(student.enrolledModules || []),
      ...(student.subjectSelection?.subjects || []),
      ...(student.subjectSelection?.enrolledModules || []),
    ];

    return Array.from(
      new Set(
        modules
          .map((module) =>
            typeof module === 'string'
              ? module.trim()
              : module?.name || module?.moduleName || '',
          )
          .filter(Boolean),
      ),
    );
  }

  private withExamTypeDescriptions<T extends ResultResponse>(
    result: T,
  ): T {
    return {
      ...result,
      modules: (result.modules || []).map((module) => ({
        ...module,
        examTypeDescription: module.examType
          ? getExamTypeDescription(module.examType)
          : null,
      })),
    };
  }
}