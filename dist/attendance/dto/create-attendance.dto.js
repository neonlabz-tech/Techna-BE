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
exports.CreateAttendanceDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateAttendanceDto {
}
exports.CreateAttendanceDto = CreateAttendanceDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '665f1b2c3d4e5f6789012345' }),
    (0, class_validator_1.IsString)({ message: 'Student ID must be a string' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Student ID is required' }),
    __metadata("design:type", String)
], CreateAttendanceDto.prototype, "studentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '665f1b2c3d4e5f6789019999' }),
    (0, class_validator_1.IsString)({ message: 'Module ID must be a string' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Module ID is required' }),
    __metadata("design:type", String)
], CreateAttendanceDto.prototype, "moduleId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Advanced ICT' }),
    (0, class_validator_1.IsString)({ message: 'Module name must be a string' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Module name is required' }),
    __metadata("design:type", String)
], CreateAttendanceDto.prototype, "moduleName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-06-10' }),
    (0, class_validator_1.IsISO8601)({ strict: true }, { message: 'Date must be a valid ISO8601 date' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Date is required' }),
    __metadata("design:type", String)
], CreateAttendanceDto.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ['present', 'absent'], example: 'present' }),
    (0, class_validator_1.IsEnum)(['present', 'absent'], { message: 'Status must be either present or absent' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Status is required' }),
    __metadata("design:type", String)
], CreateAttendanceDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-06-10T09:30:00.000Z' }),
    (0, class_validator_1.IsISO8601)({ strict: true }, { message: 'Marked at must be a valid ISO8601 datetime' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Marked at is required' }),
    __metadata("design:type", String)
], CreateAttendanceDto.prototype, "markedAt", void 0);
//# sourceMappingURL=create-attendance.dto.js.map