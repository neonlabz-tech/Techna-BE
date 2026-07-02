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
exports.RejectStudentDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
class RejectStudentDto {
}
exports.RejectStudentDto = RejectStudentDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Required documents were not provided.', minLength: 3 }),
    (0, class_transformer_1.Transform)(({ value }) => value?.trim()),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'A rejection reason is required' }),
    (0, class_validator_1.MinLength)(3, { message: 'Rejection reason must be at least 3 characters' }),
    (0, class_validator_1.Matches)(/\S/, { message: 'Rejection reason cannot be empty or whitespace only' }),
    __metadata("design:type", String)
], RejectStudentDto.prototype, "reason", void 0);
//# sourceMappingURL=reject-student.dto.js.map