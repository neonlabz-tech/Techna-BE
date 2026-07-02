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
exports.StudentsController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../decorators/roles.decorator");
const role_enum_1 = require("../enums/role.enum");
const register_student_dto_1 = require("./dto/register-student.dto");
const reject_student_dto_1 = require("./dto/reject-student.dto");
const students_service_1 = require("./students.service");
const flattenValidationErrors = (errors, parentPath = '') => errors.flatMap((error) => {
    const field = parentPath
        ? `${parentPath}.${error.property}`
        : error.property;
    const messages = Object.values(error.constraints ?? {}).map((message) => ({
        field,
        message,
    }));
    const childMessages = error.children?.length
        ? flattenValidationErrors(error.children, field)
        : [];
    return [...messages, ...childMessages];
});
let StudentsController = class StudentsController {
    constructor(studentsService) {
        this.studentsService = studentsService;
    }
    async register(payload, profilePhoto) {
        if (!payload) {
            throw new common_1.BadRequestException('Registration payload is required');
        }
        let parsedPayload;
        try {
            parsedPayload = JSON.parse(payload);
        }
        catch {
            throw new common_1.BadRequestException('Invalid registration payload');
        }
        const dto = (0, class_transformer_1.plainToInstance)(register_student_dto_1.RegisterStudentDto, parsedPayload);
        const validationErrors = await (0, class_validator_1.validate)(dto, {
            whitelist: true,
            forbidNonWhitelisted: true,
        });
        if (validationErrors.length > 0) {
            throw new common_1.BadRequestException({
                message: 'Registration validation failed',
                details: flattenValidationErrors(validationErrors),
            });
        }
        return this.studentsService.registerStudent(dto, profilePhoto);
    }
    findAll(status) {
        return this.studentsService.findAll(status);
    }
    getBatches() {
        return this.studentsService.getUniqueBatches();
    }
    async findOne(id, req) {
        if (req.user.role === role_enum_1.Role.STUDENT && req.user.userId !== id) {
            throw new common_1.ForbiddenException('You can only view your own profile');
        }
        return this.studentsService.findOne(id);
    }
    getEnrolmentHistory(id, req) {
        return this.studentsService.getEnrolmentHistory(id, req.user.userId, req.user.role);
    }
    create(body) {
        return this.studentsService.create(body);
    }
    update(id, body, req) {
        if (req.user.role === role_enum_1.Role.STUDENT && req.user.userId !== id) {
            throw new common_1.ForbiddenException('You can only update your own profile');
        }
        return this.studentsService.update(id, body);
    }
    remove(id) {
        return this.studentsService.remove(id);
    }
    approveStudent(id) {
        return this.studentsService.approveStudent(id);
    }
    rejectStudent(id, rejectStudentDto) {
        return this.studentsService.rejectStudent(id, rejectStudentDto);
    }
    generateStudentQrCode(studentId) {
        return this.studentsService.generateStudentQrCode(studentId);
    }
};
exports.StudentsController = StudentsController;
__decorate([
    (0, common_1.Post)('register'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('profilePhoto')),
    __param(0, (0, common_1.Body)('payload')),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], StudentsController.prototype, "register", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN),
    __param(0, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StudentsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('batches'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], StudentsController.prototype, "getBatches", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN, role_enum_1.Role.STUDENT),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], StudentsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':id/enrolment-history'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN, role_enum_1.Role.STUDENT),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], StudentsController.prototype, "getEnrolmentHistory", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            required: ['name', 'email', 'phone', 'batch'],
            properties: {
                name: { type: 'string', example: 'Kasun Perera' },
                email: { type: 'string', example: 'kasun.perera@example.com' },
                phone: { type: 'string', example: '0771234567' },
                batch: { type: 'string', example: '2026 Batch' },
                modules: {
                    type: 'array',
                    items: { type: 'string' },
                    example: ['Advanced ICT'],
                },
                address: { type: 'string', example: 'No. 20, Lake Road, Kandy' },
                dob: { type: 'string', example: '2008-05-20' },
                avatar: { type: 'string', example: 'https://example.com/avatar.jpg' },
                parentName: { type: 'string', example: 'Nimal Perera' },
                parentPhone: { type: 'string', example: '0712345678' },
            },
        },
    }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], StudentsController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                name: { type: 'string', example: 'Kasun Perera' },
                email: { type: 'string', example: 'kasun.perera@example.com' },
                phone: { type: 'string', example: '0771234567' },
                batch: { type: 'string', example: '2026 A/L' },
                modules: {
                    type: 'array',
                    items: { type: 'string' },
                    example: ['Advanced ICT'],
                },
                address: { type: 'string', example: 'No. 20, Lake Road, Kandy' },
                dob: { type: 'string', example: '2008-05-20' },
                avatar: { type: 'string', example: 'https://example.com/avatar.jpg' },
                parentName: { type: 'string', example: 'Nimal Perera' },
                parentPhone: { type: 'string', example: '0712345678' },
            },
        },
    }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN, role_enum_1.Role.STUDENT),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], StudentsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StudentsController.prototype, "remove", null);
__decorate([
    (0, common_1.Patch)(':id/approve'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StudentsController.prototype, "approveStudent", null);
__decorate([
    (0, common_1.Patch)(':id/reject'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, reject_student_dto_1.RejectStudentDto]),
    __metadata("design:returntype", void 0)
], StudentsController.prototype, "rejectStudent", null);
__decorate([
    (0, common_1.Post)(':studentId/qr-code'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('studentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StudentsController.prototype, "generateStudentQrCode", null);
exports.StudentsController = StudentsController = __decorate([
    (0, common_1.Controller)('students'),
    __metadata("design:paramtypes", [students_service_1.StudentsService])
], StudentsController);
//# sourceMappingURL=students.controller.js.map