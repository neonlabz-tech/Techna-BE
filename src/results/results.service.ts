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
import { Student, StudentDocument } from '../students/schemas/student.schema';

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
        (m) => m.toLowerCase() === module.moduleName.trim().toLowerCase(),
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
        student.fullNameEnglish || student.fullNameEnglish || student.email || 'Student',
      batch: student.batch || '',
      modules,
    });

    return result;
  }

  async findAll() {
    return this.resultModel.find().sort({ createdAt: -1 }).lean();
  }

  async findOne(id: string) {
    const result = await this.resultModel.findById(id).lean();

    if (!result) {
      throw new NotFoundException('Result not found');
    }

    return result;
  }

  async findByStudentId(studentId: string) {
    return this.resultModel
      .find({ studentId })
      .sort({ createdAt: -1 })
      .lean();
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

    const student = await this.studentModel.findOne({ studentId }).lean();

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    const updatePayload: any = {};

    if (dto.studentId) {
      updatePayload.studentId = student.studentId;
      updatePayload.studentName =
        student.fullNameEnglish || student.fullNameEnglish || student.email || 'Student';
      updatePayload.batch = student.batch || '';
    }

    if (dto.modules) {
      const enrolledModules = this.getStudentModules(student);

      updatePayload.modules = dto.modules.map((module) => {
        const isEnrolled = enrolledModules.some(
          (m) => m.toLowerCase() === module.moduleName.trim().toLowerCase(),
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

    return updated;
  }

  async remove(id: string) {
    const deleted = await this.resultModel.findByIdAndDelete(id).lean();

    if (!deleted) {
      throw new NotFoundException('Result not found');
    }

    return {
      message: 'Result deleted successfully',
    };
  }

  async getStudentEnrolledModules(studentId: string) {
    const student = await this.studentModel.findOne({ studentId }).lean();

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    return {
      studentId: student.studentId,
      studentName:
        student.fullNameEnglish || student.fullNameEnglish || student.email || 'Student',
      batch: student.batch || '',
      modules: this.getStudentModules(student),
    };
  }

  private calculateGrade(marks: number): 'A' | 'B' | 'C' | 'F' {
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
}