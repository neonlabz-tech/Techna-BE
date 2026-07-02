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
exports.ExamNoticesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const exam_notice_schema_1 = require("./schemas/exam-notice.schema");
const notifications_service_1 = require("../notifications/notifications.service");
const student_schema_1 = require("../students/schemas/student.schema");
const result_schema_1 = require("../results/schemas/result.schema");
let ExamNoticesService = class ExamNoticesService {
    constructor(examNoticeModel, notificationsService, studentModel, resultModel) {
        this.examNoticeModel = examNoticeModel;
        this.notificationsService = notificationsService;
        this.studentModel = studentModel;
        this.resultModel = resultModel;
    }
    async create(createExamNoticeDto) {
        const payload = {
            ...createExamNoticeDto,
            isPublished: createExamNoticeDto.isPublished ?? false,
            publishedAt: createExamNoticeDto.isPublished ? new Date() : undefined,
        };
        const examNotice = new this.examNoticeModel(payload);
        const saved = await examNotice.save();
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
    async findOne(id) {
        const examNotice = await this.examNoticeModel.findById(id);
        if (!examNotice) {
            throw new common_1.NotFoundException('Exam notice not found');
        }
        return examNotice;
    }
    async update(id, updateExamNoticeDto) {
        const existing = await this.examNoticeModel.findById(id).lean();
        if (!existing) {
            throw new common_1.NotFoundException('Exam notice not found');
        }
        const updatePayload = {
            ...updateExamNoticeDto,
        };
        if (typeof updateExamNoticeDto.isPublished === 'boolean') {
            updatePayload.publishedAt = updateExamNoticeDto.isPublished
                ? new Date()
                : null;
        }
        const updatedExamNotice = await this.examNoticeModel.findByIdAndUpdate(id, updatePayload, {
            new: true,
            runValidators: true,
        });
        if (!updatedExamNotice) {
            throw new common_1.NotFoundException('Exam notice not found');
        }
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
    async publish(id) {
        const examNotice = await this.examNoticeModel.findByIdAndUpdate(id, {
            isPublished: true,
            publishedAt: new Date(),
        }, {
            new: true,
            runValidators: true,
        });
        if (!examNotice) {
            throw new common_1.NotFoundException('Exam notice not found');
        }
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
    async unpublish(id) {
        const examNotice = await this.examNoticeModel.findByIdAndUpdate(id, {
            isPublished: false,
            publishedAt: null,
        }, {
            new: true,
            runValidators: true,
        });
        if (!examNotice) {
            throw new common_1.NotFoundException('Exam notice not found');
        }
        return examNotice;
    }
    async remove(id) {
        const deletedExamNotice = await this.examNoticeModel.findByIdAndDelete(id);
        if (!deletedExamNotice) {
            throw new common_1.NotFoundException('Exam notice not found');
        }
        return {
            message: 'Exam notice deleted successfully',
        };
    }
    async getResultsByStudentId(studentId) {
        const student = await this.studentModel
            .findOne({ studentId })
            .select('-password')
            .lean();
        if (!student) {
            throw new common_1.NotFoundException(`Student with ID ${studentId} not found`);
        }
        const studentModules = student.subjects?.length
            ? student.subjects
            : student.modules ?? [];
        const rawSchedule = await this.examNoticeModel
            .find({
            $or: [
                { moduleName: { $in: studentModules } },
                { batch: student.batch },
            ],
        })
            .sort({ date: -1 })
            .lean();
        const resultDocs = await this.resultModel
            .find({ studentId })
            .sort({ createdAt: -1 })
            .lean();
        const allModuleResults = resultDocs.flatMap((doc) => (doc.modules || []).map((m) => ({
            moduleName: m.moduleName,
            examType: m.examType,
            marks: m.marks,
            grade: m.grade,
            result: (m.grade !== 'F' ? 'pass' : 'fail'),
        })));
        const schedule = rawSchedule;
        const usedIndices = new Set();
        const enrichedSchedule = schedule.map((exam) => {
            const examModuleLower = (exam.moduleName || '').toLowerCase();
            const matchIdx = allModuleResults.findIndex((r, i) => !usedIndices.has(i) &&
                r.moduleName.toLowerCase() === examModuleLower);
            const matched = matchIdx >= 0 ? allModuleResults[matchIdx] : undefined;
            if (matchIdx >= 0)
                usedIndices.add(matchIdx);
            return {
                _id: exam._id,
                title: exam.title,
                moduleName: exam.moduleName,
                examType: matched?.examType ?? null,
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
        const standaloneResults = allModuleResults
            .filter((_, i) => !usedIndices.has(i))
            .map((r) => ({
            _id: null,
            title: r.examType,
            moduleName: r.moduleName,
            examType: r.examType,
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
        const allResults = [...enrichedSchedule, ...standaloneResults];
        const resultsWithMarks = allResults.filter((r) => r.hasResult);
        const seenKeys = new Set();
        const deduped = resultsWithMarks.filter((r) => {
            const key = `${String(r.moduleName).toLowerCase()}|${String(r.examType)}|${String(r.marks)}`;
            if (seenKeys.has(key))
                return false;
            seenKeys.add(key);
            return true;
        });
        const avgScore = deduped.length > 0
            ? Math.round(deduped.reduce((sum, r) => sum + (r.marks ?? 0), 0) /
                deduped.length)
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
};
exports.ExamNoticesService = ExamNoticesService;
exports.ExamNoticesService = ExamNoticesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(exam_notice_schema_1.ExamNotice.name)),
    __param(2, (0, mongoose_1.InjectModel)(student_schema_1.Student.name)),
    __param(3, (0, mongoose_1.InjectModel)(result_schema_1.Result.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        notifications_service_1.NotificationsService,
        mongoose_2.Model,
        mongoose_2.Model])
], ExamNoticesService);
//# sourceMappingURL=exam-notices.service.js.map