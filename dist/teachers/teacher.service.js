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
exports.TeacherService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const teacher_schema_1 = require("./schemas/teacher.schema");
const exceptions_1 = require("../common/exceptions");
let TeacherService = class TeacherService {
    constructor(teacherModel) {
        this.teacherModel = teacherModel;
    }
    async create(createTeacherDto) {
        try {
            const existingTeacher = await this.teacherModel.findOne({
                email: createTeacherDto.email,
            });
            if (existingTeacher) {
                throw new exceptions_1.ConflictException(`Teacher with email ${createTeacherDto.email} already exists`);
            }
            const teacher = await this.teacherModel.create(createTeacherDto);
            return teacher;
        }
        catch (error) {
            if (error instanceof exceptions_1.ConflictException) {
                throw error;
            }
            throw new exceptions_1.InternalServerErrorException('Failed to create teacher: ' + (error instanceof Error ? error.message : 'Unknown error'));
        }
    }
    async findAll() {
        try {
            return await this.teacherModel.find();
        }
        catch (error) {
            throw new exceptions_1.InternalServerErrorException('Failed to fetch teachers: ' + (error instanceof Error ? error.message : 'Unknown error'));
        }
    }
    async findOne(id) {
        try {
            const teacher = await this.teacherModel.findById(id);
            if (!teacher) {
                throw new exceptions_1.NotFoundException(`Teacher with ID ${id} not found`);
            }
            return teacher;
        }
        catch (error) {
            if (error instanceof exceptions_1.NotFoundException) {
                throw error;
            }
            throw new exceptions_1.InternalServerErrorException('Failed to fetch teacher: ' + (error instanceof Error ? error.message : 'Unknown error'));
        }
    }
    async update(id, updateTeacherDto) {
        try {
            const teacher = await this.teacherModel.findByIdAndUpdate(id, updateTeacherDto, { new: true, runValidators: true });
            if (!teacher) {
                throw new exceptions_1.NotFoundException(`Teacher with ID ${id} not found`);
            }
            return teacher;
        }
        catch (error) {
            if (error instanceof exceptions_1.NotFoundException) {
                throw error;
            }
            throw new exceptions_1.InternalServerErrorException('Failed to update teacher: ' + (error instanceof Error ? error.message : 'Unknown error'));
        }
    }
    async remove(id) {
        try {
            const teacher = await this.teacherModel.findByIdAndDelete(id);
            if (!teacher) {
                throw new exceptions_1.NotFoundException(`Teacher with ID ${id} not found`);
            }
            return teacher;
        }
        catch (error) {
            if (error instanceof exceptions_1.NotFoundException) {
                throw error;
            }
            throw new exceptions_1.InternalServerErrorException('Failed to delete teacher: ' + (error instanceof Error ? error.message : 'Unknown error'));
        }
    }
};
exports.TeacherService = TeacherService;
exports.TeacherService = TeacherService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(teacher_schema_1.Teacher.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], TeacherService);
//# sourceMappingURL=teacher.service.js.map