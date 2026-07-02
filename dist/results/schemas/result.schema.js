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
exports.ResultSchema = exports.Result = exports.ModuleResultSchema = exports.ModuleResult = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let ModuleResult = class ModuleResult {
};
exports.ModuleResult = ModuleResult;
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true }),
    __metadata("design:type", String)
], ModuleResult.prototype, "moduleName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: ['Mid exam', 'Final exam'] }),
    __metadata("design:type", String)
], ModuleResult.prototype, "examType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, min: 0, max: 100 }),
    __metadata("design:type", Number)
], ModuleResult.prototype, "marks", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: ['A', 'B', 'C', 'F'] }),
    __metadata("design:type", String)
], ModuleResult.prototype, "grade", void 0);
exports.ModuleResult = ModuleResult = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], ModuleResult);
exports.ModuleResultSchema = mongoose_1.SchemaFactory.createForClass(ModuleResult);
let Result = class Result {
};
exports.Result = Result;
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true }),
    __metadata("design:type", String)
], Result.prototype, "studentId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true }),
    __metadata("design:type", String)
], Result.prototype, "studentName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true }),
    __metadata("design:type", String)
], Result.prototype, "batch", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [exports.ModuleResultSchema], default: [] }),
    __metadata("design:type", Array)
], Result.prototype, "modules", void 0);
exports.Result = Result = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Result);
exports.ResultSchema = mongoose_1.SchemaFactory.createForClass(Result);
//# sourceMappingURL=result.schema.js.map