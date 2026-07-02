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
exports.RegisterStudentDto = exports.SubjectSectionDto = exports.OlRecordsSectionDto = exports.ParentSectionDto = exports.PersonalSectionDto = exports.AccountSectionDto = exports.OlResultRowDto = void 0;
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class OlResultRowDto {
}
exports.OlResultRowDto = OlResultRowDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], OlResultRowDto.prototype, "year", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '12345678' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], OlResultRowDto.prototype, "indexNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'A' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], OlResultRowDto.prototype, "english", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'B' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], OlResultRowDto.prototype, "mathematics", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'C' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], OlResultRowDto.prototype, "science", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'A' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], OlResultRowDto.prototype, "sinhala", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'B' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], OlResultRowDto.prototype, "tamil", void 0);
class AccountSectionDto {
}
exports.AccountSectionDto = AccountSectionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'kasun.perera@example.com' }),
    (0, class_validator_1.IsEmail)({}, { message: 'A valid email address is required' }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], AccountSectionDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'password123', minLength: 6 }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(6, { message: 'Password must be at least 6 characters' }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], AccountSectionDto.prototype, "password", void 0);
class PersonalSectionDto {
}
exports.PersonalSectionDto = PersonalSectionDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Kasun Perera Tamil Name' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PersonalSectionDto.prototype, "fullNameTamil", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Kasun Perera' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Full name in English is required' }),
    __metadata("design:type", String)
], PersonalSectionDto.prototype, "fullNameEnglish", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2008-05-20' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], PersonalSectionDto.prototype, "dateOfBirth", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 20, minimum: 1, maximum: 31 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(31),
    __metadata("design:type", Number)
], PersonalSectionDto.prototype, "dobDay", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 5, minimum: 1, maximum: 12 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(12),
    __metadata("design:type", Number)
], PersonalSectionDto.prototype, "dobMonth", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 2008, minimum: 1900 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1900),
    (0, class_validator_1.Max)(new Date().getFullYear()),
    __metadata("design:type", Number)
], PersonalSectionDto.prototype, "dobYear", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '200812345678' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'NIC number is required' }),
    __metadata("design:type", String)
], PersonalSectionDto.prototype, "nicNo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Central College' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PersonalSectionDto.prototype, "school", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '0771234567' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'WhatsApp number is required' }),
    (0, class_validator_1.Matches)(/^(?:\+94|0094|0)[0-9]{9}$/, {
        message: 'Invalid WhatsApp number - use format: 0771234567 or +94771234567',
    }),
    __metadata("design:type", String)
], PersonalSectionDto.prototype, "whatsappNo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '0712345678' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PersonalSectionDto.prototype, "parentsNo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'No. 20, Lake Road, Kandy' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Permanent address is required' }),
    __metadata("design:type", String)
], PersonalSectionDto.prototype, "permanentAddress", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Kandy' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PersonalSectionDto.prototype, "administrativeDistrict", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '0812223344' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PersonalSectionDto.prototype, "fixedTelephone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2015' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PersonalSectionDto.prototype, "residingSince", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Sinhala' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PersonalSectionDto.prototype, "race", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Buddhism' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PersonalSectionDto.prototype, "religion", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'YES' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PersonalSectionDto.prototype, "citizenByDescent", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'No. 25, School Road, Kandy' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PersonalSectionDto.prototype, "contactAddress", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '20000' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PersonalSectionDto.prototype, "postalCode", void 0);
class ParentSectionDto {
}
exports.ParentSectionDto = ParentSectionDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Nimal Perera' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ParentSectionDto.prototype, "fatherName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Kumari Perera' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ParentSectionDto.prototype, "motherName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Sunil Perera' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ParentSectionDto.prototype, "guardianName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Father' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ParentSectionDto.prototype, "contactPerson", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'No. 20, Lake Road, Kandy' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ParentSectionDto.prototype, "guardianAddress", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '0812223344' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ParentSectionDto.prototype, "guardianFixedTel", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '0712345678' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ParentSectionDto.prototype, "guardianMobile", void 0);
class OlRecordsSectionDto {
}
exports.OlRecordsSectionDto = OlRecordsSectionDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Local O/L' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], OlRecordsSectionDto.prototype, "olCategory", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2024' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], OlRecordsSectionDto.prototype, "olYear", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '12345678' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], OlRecordsSectionDto.prototype, "olIndexNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Kasun Perera' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], OlRecordsSectionDto.prototype, "olNameUsed", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Accept' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], OlRecordsSectionDto.prototype, "olAccept", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [OlResultRowDto] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => OlResultRowDto),
    __metadata("design:type", Array)
], OlRecordsSectionDto.prototype, "olResults", void 0);
class SubjectSectionDto {
}
exports.SubjectSectionDto = SubjectSectionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ isArray: true, example: ['Information Communication Technology'] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1, { message: 'At least one subject must be selected' }),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], SubjectSectionDto.prototype, "subjects", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    (0, class_validator_1.IsBoolean)({ message: 'You must agree to the terms to submit' }),
    __metadata("design:type", Boolean)
], SubjectSectionDto.prototype, "agreed", void 0);
class RegisterStudentDto {
}
exports.RegisterStudentDto = RegisterStudentDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: AccountSectionDto }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => AccountSectionDto),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", AccountSectionDto)
], RegisterStudentDto.prototype, "account", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: PersonalSectionDto }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => PersonalSectionDto),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", PersonalSectionDto)
], RegisterStudentDto.prototype, "personal", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: ParentSectionDto }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => ParentSectionDto),
    __metadata("design:type", ParentSectionDto)
], RegisterStudentDto.prototype, "parent", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: OlRecordsSectionDto }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => OlRecordsSectionDto),
    __metadata("design:type", OlRecordsSectionDto)
], RegisterStudentDto.prototype, "olRecords", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: SubjectSectionDto }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => SubjectSectionDto),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", SubjectSectionDto)
], RegisterStudentDto.prototype, "subjectSelection", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2026 A/L' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RegisterStudentDto.prototype, "batch", void 0);
//# sourceMappingURL=register-student.dto.js.map