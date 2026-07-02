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
exports.PublicTeachersController = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const swagger_1 = require("@nestjs/swagger");
const public_decorator_1 = require("../auth/public.decorator");
const teacher_schema_1 = require("./schemas/teacher.schema");
const PUBLIC_SELECT = 'fullName firstName lastName email phone subject qualification experience ' +
    'specializations awards achievements biography photoUrl degree';
let PublicTeachersController = class PublicTeachersController {
    constructor(teacherModel) {
        this.teacherModel = teacherModel;
    }
    async findAllPublic() {
        return this.teacherModel
            .find({ status: 'active' })
            .select(PUBLIC_SELECT)
            .lean();
    }
    async findBySubject(subjectName) {
        const teacher = await this.teacherModel
            .findOne({ subject: subjectName, status: 'active' })
            .select(PUBLIC_SELECT)
            .lean();
        if (!teacher)
            throw new common_1.NotFoundException('No teacher found for this subject');
        return teacher;
    }
    async findPublicById(id) {
        const teacher = await this.teacherModel
            .findById(id)
            .select(PUBLIC_SELECT)
            .lean();
        if (!teacher)
            throw new common_1.NotFoundException('Teacher not found');
        return teacher;
    }
};
exports.PublicTeachersController = PublicTeachersController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all active teachers (no auth required)' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PublicTeachersController.prototype, "findAllPublic", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('by-subject/:subjectName'),
    (0, swagger_1.ApiOperation)({ summary: 'Find first teacher for a given subject name (no auth required)' }),
    __param(0, (0, common_1.Param)('subjectName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PublicTeachersController.prototype, "findBySubject", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get public teacher profile by ID (no auth required)' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PublicTeachersController.prototype, "findPublicById", null);
exports.PublicTeachersController = PublicTeachersController = __decorate([
    (0, swagger_1.ApiTags)('public-teachers'),
    (0, common_1.Controller)('public/teachers'),
    __param(0, (0, mongoose_1.InjectModel)(teacher_schema_1.Teacher.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], PublicTeachersController);
//# sourceMappingURL=public-teachers.controller.js.map