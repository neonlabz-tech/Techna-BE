"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResultsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const result_schema_1 = require("./schemas/result.schema");
const student_schema_1 = require("../students/schemas/student.schema");
let ResultsService = class ResultsService {
    constructor(resultModel, studentModel) {
        this.resultModel = resultModel;
        this.studentModel = studentModel;
    }
    async create(dto) {
        const student = await this.studentModel
            .findOne({ studentId: dto.studentId })
            .lean();
        if (!student) {
            throw new common_1.NotFoundException('Student not found');
        }
        const enrolledModules = this.getStudentModules(student);
        if (enrolledModules.length === 0) {
            throw new common_1.BadRequestException('Student has no enrolled modules');
        }
        const modules = dto.modules.map((module) => {
            const isEnrolled = enrolledModules.some((m) => m.toLowerCase() === module.moduleName.trim().toLowerCase());
            if (!isEnrolled) {
                throw new common_1.BadRequestException(`${module.moduleName} is not enrolled by this student`);
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
            studentName: student.fullNameEnglish || student.fullNameEnglish || student.email || 'Student',
            batch: student.batch || '',
            modules,
        });
        return result;
    }
    async findAll() {
        return this.resultModel.find().sort({ createdAt: -1 }).lean();
    }
    async findOne(id) {
        const result = await this.resultModel.findById(id).lean();
        if (!result) {
            throw new common_1.NotFoundException('Result not found');
        }
        return result;
    }
    async findByStudentId(studentId) {
        return this.resultModel
            .find({ studentId })
            .sort({ createdAt: -1 })
            .lean();
    }
    async update(id, dto) {
        if (!mongoose_2.Types.ObjectId.isValid(id)) {
            throw new common_1.BadRequestException('Invalid result id');
        }
        const existing = await this.resultModel.findById(id);
        if (!existing) {
            throw new common_1.NotFoundException('Result not found');
        }
        let studentId = existing.studentId;
        if (dto.studentId) {
            studentId = dto.studentId;
        }
        const student = await this.studentModel.findOne({ studentId }).lean();
        if (!student) {
            throw new common_1.NotFoundException('Student not found');
        }
        const updatePayload = {};
        if (dto.studentId) {
            updatePayload.studentId = student.studentId;
            updatePayload.studentName =
                student.fullNameEnglish || student.fullNameEnglish || student.email || 'Student';
            updatePayload.batch = student.batch || '';
        }
        if (dto.modules) {
            const enrolledModules = this.getStudentModules(student);
            updatePayload.modules = dto.modules.map((module) => {
                const isEnrolled = enrolledModules.some((m) => m.toLowerCase() === module.moduleName.trim().toLowerCase());
                if (!isEnrolled) {
                    throw new common_1.BadRequestException(`${module.moduleName} is not enrolled by this student`);
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
    async remove(id) {
        const deleted = await this.resultModel.findByIdAndDelete(id).lean();
        if (!deleted) {
            throw new common_1.NotFoundException('Result not found');
        }
        return {
            message: 'Result deleted successfully',
        };
    }
    async getStudentEnrolledModules(studentId) {
        const student = await this.studentModel.findOne({ studentId }).lean();
        if (!student) {
            throw new common_1.NotFoundException('Student not found');
        }
        return {
            studentId: student.studentId,
            studentName: student.fullNameEnglish || student.fullNameEnglish || student.email || 'Student',
            batch: student.batch || '',
            modules: this.getStudentModules(student),
        };
    }
    calculateGrade(marks) {
        if (marks < 0 || marks > 100) {
            throw new common_1.BadRequestException('Marks must be between 0 and 100');
        }
        if (marks >= 75)
            return 'A';
        if (marks >= 65)
            return 'B';
        if (marks >= 35)
            return 'C';
        return 'F';
    }
    getStudentModules(student) {
        const modules = [
            ...(student.subjects || []),
            ...(student.modules || []),
            ...(student.enrolledModules || []),
            ...(student.subjectSelection?.subjects || []),
            ...(student.subjectSelection?.enrolledModules || []),
        ];
        return Array.from(new Set(modules
            .map((module) => typeof module === 'string'
            ? module.trim()
            : module?.name || module?.moduleName || '')
            .filter(Boolean)));
    }
};
exports.ResultsService = ResultsService;
exports.ResultsService = ResultsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(result_schema_1.Result.name)),
    __param(1, (0, mongoose_1.InjectModel)(student_schema_1.Student.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], ResultsService);
//# sourceMappingURL=results.service.js.map