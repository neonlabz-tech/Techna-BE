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
exports.StudentSchema = exports.Student = exports.District = exports.AlSubject = exports.OlResultRowSchema = exports.OlResultRow = exports.OlGrade = void 0;
const mongoose_1 = require("@nestjs/mongoose");
var OlGrade;
(function (OlGrade) {
    OlGrade["A_PLUS"] = "A+";
    OlGrade["A"] = "A";
    OlGrade["A_MINUS"] = "A-";
    OlGrade["B_PLUS"] = "B+";
    OlGrade["B"] = "B";
    OlGrade["B_MINUS"] = "B-";
    OlGrade["C_PLUS"] = "C+";
    OlGrade["C"] = "C";
    OlGrade["C_MINUS"] = "C-";
    OlGrade["S"] = "S";
    OlGrade["F"] = "F";
    OlGrade["AB"] = "AB";
})(OlGrade || (exports.OlGrade = OlGrade = {}));
let OlResultRow = class OlResultRow {
};
exports.OlResultRow = OlResultRow;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], OlResultRow.prototype, "year", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], OlResultRow.prototype, "indexNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: null }),
    __metadata("design:type", String)
], OlResultRow.prototype, "english", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: null }),
    __metadata("design:type", String)
], OlResultRow.prototype, "mathematics", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: null }),
    __metadata("design:type", String)
], OlResultRow.prototype, "science", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: null }),
    __metadata("design:type", String)
], OlResultRow.prototype, "sinhala", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: null }),
    __metadata("design:type", String)
], OlResultRow.prototype, "tamil", void 0);
exports.OlResultRow = OlResultRow = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], OlResultRow);
exports.OlResultRowSchema = mongoose_1.SchemaFactory.createForClass(OlResultRow);
var AlSubject;
(function (AlSubject) {
    AlSubject["ENGINEERING_TECHNOLOGY"] = "Engineering Technology";
    AlSubject["BIO_SYSTEMS_TECHNOLOGY"] = "Bio Systems Technology";
    AlSubject["SCIENCE_FOR_TECHNOLOGY"] = "Science For Technology";
    AlSubject["ICT"] = "Information Communication Technology";
    AlSubject["AGRICULTURAL_SCIENCE"] = "Agricultural Science";
    AlSubject["MATHEMATICS"] = "Mathematics";
    AlSubject["GEOGRAPHY"] = "Geography";
})(AlSubject || (exports.AlSubject = AlSubject = {}));
var District;
(function (District) {
    District["COLOMBO"] = "Colombo";
    District["GAMPAHA"] = "Gampaha";
    District["KALUTARA"] = "Kalutara";
    District["KANDY"] = "Kandy";
    District["MATALE"] = "Matale";
    District["NUWARA_ELIYA"] = "Nuwara Eliya";
    District["GALLE"] = "Galle";
    District["MATARA"] = "Matara";
    District["HAMBANTOTA"] = "Hambantota";
    District["JAFFNA"] = "Jaffna";
    District["KILINOCHCHI"] = "Kilinochchi";
    District["MANNAR"] = "Mannar";
    District["MULLAITIVU"] = "Mullaitivu";
    District["VAVUNIYA"] = "Vavuniya";
    District["PUTTALAM"] = "Puttalam";
    District["KURUNEGALA"] = "Kurunegala";
    District["ANURADHAPURA"] = "Anuradhapura";
    District["POLONNARUWA"] = "Polonnaruwa";
    District["BADULLA"] = "Badulla";
    District["MONARAGALA"] = "Monaragala";
    District["RATNAPURA"] = "Ratnapura";
    District["KEGALLE"] = "Kegalle";
    District["AMPARA"] = "Ampara";
    District["BATTICALOA"] = "Batticaloa";
    District["TRINCOMALEE"] = "Trincomalee";
})(District || (exports.District = District = {}));
let Student = class Student {
};
exports.Student = Student;
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], Student.prototype, "studentId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], Student.prototype, "qrToken", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Student.prototype, "qrCode", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Student.prototype, "qrImageKey", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Student.prototype, "qrCodeUrl", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, lowercase: true, trim: true }),
    __metadata("design:type", String)
], Student.prototype, "email", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Student.prototype, "password", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Student.prototype, "phone", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '' }),
    __metadata("design:type", String)
], Student.prototype, "batch", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], Student.prototype, "modules", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
    }),
    __metadata("design:type", String)
], Student.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Student.prototype, "enrolledAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Student.prototype, "approvedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Student.prototype, "rejectionReason", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Student.prototype, "avatar", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Student.prototype, "profilePhoto", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Student.prototype, "profilePhotoKey", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Student.prototype, "parentName", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Student.prototype, "parentPhone", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Student.prototype, "address", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Student.prototype, "dob", void 0);
__decorate([
    (0, mongoose_1.Prop)({ unique: true, sparse: true }),
    __metadata("design:type", String)
], Student.prototype, "admissionNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)({ unique: true, sparse: true }),
    __metadata("design:type", String)
], Student.prototype, "serialNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)({ unique: true, sparse: true }),
    __metadata("design:type", String)
], Student.prototype, "applicationReference", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Student.prototype, "fullNameTamil", void 0);
__decorate([
    (0, mongoose_1.Prop)({ uppercase: true }),
    __metadata("design:type", String)
], Student.prototype, "fullNameEnglish", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Student.prototype, "dateOfBirth", void 0);
__decorate([
    (0, mongoose_1.Prop)({ unique: true, sparse: true }),
    __metadata("design:type", String)
], Student.prototype, "nicNo", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Student.prototype, "school", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Student.prototype, "whatsappNo", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Student.prototype, "parentsNo", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Student.prototype, "permanentAddress", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: '' }),
    __metadata("design:type", String)
], Student.prototype, "administrativeDistrict", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Student.prototype, "fixedTelephone", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Student.prototype, "residingSince", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: '' }),
    __metadata("design:type", String)
], Student.prototype, "race", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: '' }),
    __metadata("design:type", String)
], Student.prototype, "religion", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: 'YES' }),
    __metadata("design:type", String)
], Student.prototype, "citizenByDescent", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Student.prototype, "contactAddress", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Student.prototype, "postalCode", void 0);
__decorate([
    (0, mongoose_1.Prop)({ uppercase: true }),
    __metadata("design:type", String)
], Student.prototype, "fatherName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ uppercase: true }),
    __metadata("design:type", String)
], Student.prototype, "motherName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ uppercase: true }),
    __metadata("design:type", String)
], Student.prototype, "guardianName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: 'Mother' }),
    __metadata("design:type", String)
], Student.prototype, "contactPerson", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Student.prototype, "guardianAddress", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Student.prototype, "guardianFixedTel", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Student.prototype, "guardianMobile", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: 'Local O/L' }),
    __metadata("design:type", String)
], Student.prototype, "olCategory", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Student.prototype, "olYear", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Student.prototype, "olIndexNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)({ uppercase: true }),
    __metadata("design:type", String)
], Student.prototype, "olNameUsed", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: 'Accept' }),
    __metadata("design:type", String)
], Student.prototype, "olAccept", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [exports.OlResultRowSchema], default: [] }),
    __metadata("design:type", Array)
], Student.prototype, "olResults", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], Student.prototype, "subjects", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Boolean)
], Student.prototype, "agreed", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], Student.prototype, "resetToken", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date }),
    __metadata("design:type", Date)
], Student.prototype, "resetTokenExpiry", void 0);
exports.Student = Student = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Student);
exports.StudentSchema = mongoose_1.SchemaFactory.createForClass(Student);
//# sourceMappingURL=student.schema.js.map