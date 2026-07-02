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
exports.ExamNoticesController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const create_exam_notice_dto_1 = require("./dto/create-exam-notice.dto");
const update_exam_notice_dto_1 = require("./dto/update-exam-notice.dto");
const exam_notices_service_1 = require("./exam-notices.service");
let ExamNoticesController = class ExamNoticesController {
    constructor(examNoticesService) {
        this.examNoticesService = examNoticesService;
    }
    create(createExamNoticeDto) {
        return this.examNoticesService.create(createExamNoticeDto);
    }
    findAll() {
        return this.examNoticesService.findAll();
    }
    findPublished() {
        return this.examNoticesService.findPublished();
    }
    getResultsByStudentId(studentId) {
        return this.examNoticesService.getResultsByStudentId(studentId);
    }
    getResultsByStudentIdPublic(studentId) {
        return this.examNoticesService.getResultsByStudentId(studentId);
    }
    findOne(id) {
        return this.examNoticesService.findOne(id);
    }
    update(id, updateExamNoticeDto) {
        return this.examNoticesService.update(id, updateExamNoticeDto);
    }
    publish(id) {
        return this.examNoticesService.publish(id);
    }
    unpublish(id) {
        return this.examNoticesService.unpublish(id);
    }
    remove(id) {
        return this.examNoticesService.remove(id);
    }
};
exports.ExamNoticesController = ExamNoticesController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_exam_notice_dto_1.CreateExamNoticeDto]),
    __metadata("design:returntype", void 0)
], ExamNoticesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ExamNoticesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('public'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ExamNoticesController.prototype, "findPublished", null);
__decorate([
    (0, common_1.Get)('student/:studentId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('studentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ExamNoticesController.prototype, "getResultsByStudentId", null);
__decorate([
    (0, common_1.Get)('student/:studentId/public'),
    __param(0, (0, common_1.Param)('studentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ExamNoticesController.prototype, "getResultsByStudentIdPublic", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ExamNoticesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_exam_notice_dto_1.UpdateExamNoticeDto]),
    __metadata("design:returntype", void 0)
], ExamNoticesController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/publish'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ExamNoticesController.prototype, "publish", null);
__decorate([
    (0, common_1.Patch)(':id/unpublish'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ExamNoticesController.prototype, "unpublish", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ExamNoticesController.prototype, "remove", null);
exports.ExamNoticesController = ExamNoticesController = __decorate([
    (0, common_1.Controller)('exam-notices'),
    __metadata("design:paramtypes", [exam_notices_service_1.ExamNoticesService])
], ExamNoticesController);
//# sourceMappingURL=exam-notices.controller.js.map