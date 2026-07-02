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
exports.AttendanceService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const student_schema_1 = require("../students/schemas/student.schema");
const module_schema_1 = require("../modules/schemas/module.schema");
const attendance_schema_1 = require("./schemas/attendance.schema");
const exceptions_1 = require("../common/exceptions");
const ATTENDANCE_STATUSES = ['present', 'absent'];
let AttendanceService = class AttendanceService {
    constructor(attendanceModel, studentModel, moduleModel) {
        this.attendanceModel = attendanceModel;
        this.studentModel = studentModel;
        this.moduleModel = moduleModel;
    }
    async create(dto) {
        try {
            const studentExists = await this.studentModel.findOne({
                studentId: dto.studentId,
            });
            if (!studentExists) {
                throw new exceptions_1.NotFoundException('Student not found');
            }
            if (!ATTENDANCE_STATUSES.includes(dto.status)) {
                throw new exceptions_1.BadRequestException('Invalid attendance status');
            }
            await this.ensureUniqueAttendanceSession(dto);
            const dateToUse = dto.date ?? new Date().toISOString();
            const sessionDate = this.normalizeSessionDate(dateToUse);
            const attendance = await this.attendanceModel.create({
                ...dto,
                studentId: dto.studentId,
                date: dateToUse,
                sessionDate,
            });
            return attendance;
        }
        catch (error) {
            if (error instanceof exceptions_1.BadRequestException ||
                error instanceof exceptions_1.NotFoundException ||
                error instanceof exceptions_1.ConflictException) {
                throw error;
            }
            if (error?.code === 11000) {
                throw new exceptions_1.ConflictException('Attendance already marked for this session');
            }
            const message = error instanceof Error ? error.message : 'Internal server error';
            throw new exceptions_1.InternalServerErrorException(message);
        }
    }
    async scanQr(dto) {
        const qrToken = dto.qrToken?.trim();
        if (!qrToken) {
            throw new exceptions_1.BadRequestException('QR token is required');
        }
        const student = await this.studentModel
            .findOne({ qrToken })
            .exec();
        if (!student) {
            throw new exceptions_1.NotFoundException('Student not found');
        }
        if (student.status !== 'approved') {
            throw new exceptions_1.BadRequestException('Student is not approved');
        }
        const moduleRecord = (0, mongoose_2.isValidObjectId)(dto.moduleId)
            ? await this.moduleModel.findById(dto.moduleId).exec()
            : null;
        if (!moduleRecord) {
            throw new exceptions_1.NotFoundException('Module not found');
        }
        const attendance = await this.create({
            studentId: student.studentId,
            moduleId: dto.moduleId,
            moduleName: moduleRecord.name,
            date: dto.date ?? new Date().toISOString(),
            status: dto.status ?? 'present',
            markedAt: dto.markedAt ?? new Date().toISOString(),
        });
        return {
            success: true,
            message: 'Attendance marked successfully',
            attendance,
        };
    }
    async findAll() {
        return this.attendanceModel
            .find()
            .populate('studentId')
            .sort({ createdAt: -1 })
            .exec();
    }
    async findOne(id) {
        if (!(0, mongoose_2.isValidObjectId)(id)) {
            throw new exceptions_1.BadRequestException('Invalid attendance id');
        }
        const attendance = await this.attendanceModel
            .findById(id)
            .populate('studentId')
            .exec();
        if (!attendance) {
            throw new exceptions_1.NotFoundException('Attendance not found');
        }
        return attendance;
    }
    async update(id, dto) {
        if (!(0, mongoose_2.isValidObjectId)(id)) {
            throw new exceptions_1.BadRequestException('Invalid attendance id');
        }
        const updated = await this.attendanceModel
            .findByIdAndUpdate(id, dto, {
            new: true,
            runValidators: true,
        })
            .exec();
        if (!updated) {
            throw new exceptions_1.NotFoundException('Attendance not found');
        }
        return updated;
    }
    async remove(id) {
        if (!(0, mongoose_2.isValidObjectId)(id)) {
            throw new exceptions_1.BadRequestException('Invalid attendance id');
        }
        const deleted = await this.attendanceModel.findByIdAndDelete(id);
        if (!deleted) {
            throw new exceptions_1.NotFoundException('Attendance not found');
        }
    }
    async findByStudent(studentId) {
        const student = await this.studentModel.findOne({ studentId });
        if (!student) {
            throw new exceptions_1.NotFoundException('Student not found');
        }
        return this.attendanceModel
            .find({ studentId })
            .sort({ createdAt: -1 })
            .exec();
    }
    async getReport(query) {
        try {
            const dateFilter = this.buildDateFilter(query.date, query.from, query.to);
            const studentFilter = { status: 'approved' };
            if (query.studentId) {
                studentFilter.studentId = query.studentId;
                delete studentFilter.status;
            }
            if (query.batch) {
                studentFilter.batch = query.batch;
            }
            if (query.moduleId) {
                studentFilter.modules = query.moduleId;
            }
            const students = await this.studentModel
                .find(studentFilter)
                .select('studentId name batch modules status')
                .lean()
                .exec();
            if (query.studentId && students.length === 0) {
                throw new exceptions_1.NotFoundException(`Student ${query.studentId} not found`);
            }
            const studentIds = students.map((student) => student.studentId);
            const attendanceFilter = {};
            if (studentIds.length > 0) {
                attendanceFilter.studentId = { $in: studentIds };
            }
            else if (query.studentId) {
                attendanceFilter.studentId = query.studentId;
            }
            if (query.moduleId) {
                attendanceFilter.moduleId = query.moduleId;
            }
            if (dateFilter) {
                attendanceFilter.date = dateFilter;
            }
            const attendanceRecords = await this.attendanceModel
                .find(attendanceFilter)
                .sort({ date: 1, studentId: 1, moduleId: 1 })
                .lean()
                .exec();
            const groupedStudents = students.map((student) => {
                const records = attendanceRecords.filter((record) => record.studentId === student.studentId);
                return {
                    id: student.studentId,
                    studentId: student.studentId,
                    name: student.name,
                    batch: student.batch,
                    modules: student.modules,
                    attendance: records.map((record) => this.mapAttendanceRecord(record)),
                };
            });
            return {
                filters: {
                    studentId: query.studentId ?? null,
                    moduleId: query.moduleId ?? null,
                    batch: query.batch ?? null,
                    from: query.from ?? null,
                    to: query.to ?? null,
                    date: query.date ?? null,
                },
                summary: {
                    totalStudents: groupedStudents.length,
                    totalRecords: attendanceRecords.length,
                    present: attendanceRecords.filter((r) => r.status === 'present').length,
                    absent: attendanceRecords.filter((r) => r.status === 'absent').length,
                },
                students: groupedStudents,
            };
        }
        catch (error) {
            if (error instanceof exceptions_1.BadRequestException || error instanceof exceptions_1.NotFoundException) {
                throw error;
            }
            throw new exceptions_1.InternalServerErrorException('Failed to generate attendance report');
        }
    }
    buildDateFilter(date, from, to) {
        if (date) {
            this.assertDateString(date, 'date');
            return date;
        }
        if (!from && !to) {
            return undefined;
        }
        if (from) {
            this.assertDateString(from, 'from');
        }
        if (to) {
            this.assertDateString(to, 'to');
        }
        if (from && to && from > to) {
            throw new exceptions_1.BadRequestException('from must be less than or equal to to');
        }
        return {
            ...(from ? { $gte: from } : {}),
            ...(to ? { $lte: to } : {}),
        };
    }
    normalizeSessionDate(date) {
        return new Date(date).toISOString().split('T')[0];
    }
    async ensureUniqueAttendanceSession(dto) {
        const normalizedDate = this.normalizeSessionDate(dto.date);
        const existing = await this.attendanceModel
            .findOne({
            studentId: dto.studentId,
            moduleId: dto.moduleId,
            date: { $regex: `^${normalizedDate}` },
        })
            .exec();
        if (existing) {
            throw new exceptions_1.ConflictException('Attendance already marked for this session');
        }
    }
    assertDateString(value, field) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
            throw new exceptions_1.BadRequestException(`${field} must be in YYYY-MM-DD format`);
        }
    }
    mapAttendanceRecord(record) {
        return {
            id: String(record._id ?? ''),
            studentId: record.studentId,
            moduleId: record.moduleId,
            moduleName: record.moduleName,
            date: record.date,
            status: record.status,
            markedAt: record.markedAt,
        };
    }
};
exports.AttendanceService = AttendanceService;
exports.AttendanceService = AttendanceService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(attendance_schema_1.Attendance.name)),
    __param(1, (0, mongoose_1.InjectModel)(student_schema_1.Student.name)),
    __param(2, (0, mongoose_1.InjectModel)(module_schema_1.Module.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], AttendanceService);
//# sourceMappingURL=attendance.service.js.map