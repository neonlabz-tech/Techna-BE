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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateExamNoticeDto = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateExamNoticeDto {
}
exports.CreateExamNoticeDto = CreateExamNoticeDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Final Term ICT Exam' }),
    (0, class_validator_1.IsString)({ message: 'Title must be a string' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Title is required' }),
    __metadata("design:type", String)
], CreateExamNoticeDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '665f1b2c3d4e5f6789019999' }),
    (0, class_validator_1.IsString)({ message: 'Module ID must be a string' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Module ID is required' }),
    __metadata("design:type", String)
], CreateExamNoticeDto.prototype, "moduleId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Advanced ICT' }),
    (0, class_validator_1.IsString)({ message: 'Module name must be a string' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Module name is required' }),
    __metadata("design:type", String)
], CreateExamNoticeDto.prototype, "moduleName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026 A/L' }),
    (0, class_validator_1.IsString)({ message: 'Batch must be a string' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Batch is required' }),
    __metadata("design:type", String)
], CreateExamNoticeDto.prototype, "batch", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-07-15' }),
    (0, class_validator_1.IsString)({ message: 'Date must be a string' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Date is required' }),
    __metadata("design:type", String)
], CreateExamNoticeDto.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '09:00' }),
    (0, class_validator_1.IsString)({ message: 'Start time must be a string' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Start time is required' }),
    __metadata("design:type", String)
], CreateExamNoticeDto.prototype, "startTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '12:00' }),
    (0, class_validator_1.IsString)({ message: 'End time must be a string' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'End time is required' }),
    __metadata("design:type", String)
], CreateExamNoticeDto.prototype, "endTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Main Hall' }),
    (0, class_validator_1.IsString)({ message: 'Venue must be a string' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Venue is required' }),
    __metadata("design:type", String)
], CreateExamNoticeDto.prototype, "venue", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Bring calculator and admission card.' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Description must be a string' }),
    __metadata("design:type", String)
], CreateExamNoticeDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 100, minimum: 0 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)({}, { message: 'Total marks must be a number' }),
    (0, class_validator_1.Min)(0, { message: 'Total marks must be greater than or equal to 0' }),
    __metadata("design:type", Number)
], CreateExamNoticeDto.prototype, "totalMarks", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: ['upcoming', 'ongoing', 'completed'],
        example: 'upcoming',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Status must be a string' }),
    (0, class_validator_1.IsIn)(['upcoming', 'ongoing', 'completed'], {
        message: 'Status must be either upcoming, ongoing, or completed',
    }),
    __metadata("design:type", String)
], CreateExamNoticeDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Boolean),
    (0, class_validator_1.IsBoolean)({ message: 'Published status must be a boolean' }),
    __metadata("design:type", Boolean)
], CreateExamNoticeDto.prototype, "isPublished", void 0);
//# sourceMappingURL=create-exam-notice.dto.js.map