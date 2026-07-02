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
exports.CreateModuleDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateModuleDto {
}
exports.CreateModuleDto = CreateModuleDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Advanced ICT', minLength: 3 }),
    (0, class_validator_1.IsString)({ message: 'Name must be a string' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Name is required' }),
    (0, class_validator_1.MinLength)(3, { message: 'Name must be at least 3 characters' }),
    __metadata("design:type", String)
], CreateModuleDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '665f1b2c3d4e5f6789012345' }),
    (0, class_validator_1.IsString)({ message: 'Teacher ID must be a string' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Teacher ID is required' }),
    __metadata("design:type", String)
], CreateModuleDto.prototype, "teacherId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'John Silva' }),
    (0, class_validator_1.IsString)({ message: 'Teacher name must be a string' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Teacher name is required' }),
    __metadata("design:type", String)
], CreateModuleDto.prototype, "teacherName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'A/L ICT theory and practical module' }),
    (0, class_validator_1.IsString)({ message: 'Description must be a string' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Description is required' }),
    (0, class_validator_1.MinLength)(3, { message: 'Description must be at least 3 characters' }),
    __metadata("design:type", String)
], CreateModuleDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '6 months' }),
    (0, class_validator_1.IsString)({ message: 'Duration must be a string' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Duration is required' }),
    __metadata("design:type", String)
], CreateModuleDto.prototype, "duration", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 25000 }),
    (0, class_validator_1.IsNumber)({}, { message: 'Fee must be a number' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Fee is required' }),
    (0, class_validator_1.IsPositive)({ message: 'Fee must be greater than 0' }),
    __metadata("design:type", Number)
], CreateModuleDto.prototype, "fee", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026 A/L' }),
    (0, class_validator_1.IsString)({ message: 'Batch must be a string' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Batch is required' }),
    __metadata("design:type", String)
], CreateModuleDto.prototype, "batch", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ['active', 'inactive'], example: 'active' }),
    (0, class_validator_1.IsEnum)(['active', 'inactive'], { message: 'Status must be either active or inactive' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Status is required' }),
    __metadata("design:type", String)
], CreateModuleDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Term 1' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateModuleDto.prototype, "term", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 3 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateModuleDto.prototype, "unit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: ['main', 'basket', 'none'], example: 'none' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['main', 'basket', 'none']),
    __metadata("design:type", String)
], CreateModuleDto.prototype, "subjectCategory", void 0);
//# sourceMappingURL=create-module.dto.js.map