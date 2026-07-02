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
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const attendance_schema_1 = require("../attendance/schemas/attendance.schema");
const payment_schema_1 = require("../payments/schemas/payment.schema");
const student_schema_1 = require("../students/schemas/student.schema");
const teacher_schema_1 = require("../teachers/schemas/teacher.schema");
const module_schema_1 = require("../modules/schemas/module.schema");
let DashboardService = class DashboardService {
    constructor(studentModel, teacherModel, moduleModel, attendanceModel, paymentModel) {
        this.studentModel = studentModel;
        this.teacherModel = teacherModel;
        this.moduleModel = moduleModel;
        this.attendanceModel = attendanceModel;
        this.paymentModel = paymentModel;
    }
    async getSummary() {
        try {
            const today = new Date().toISOString().split('T')[0];
            const [totalStudents, totalTeachers, totalModules, present, absent, pendingPayments, paidPayments,] = await Promise.all([
                this.studentModel.countDocuments().exec(),
                this.teacherModel.countDocuments().exec(),
                this.moduleModel.countDocuments().exec(),
                this.attendanceModel.countDocuments({ date: today, status: 'present' }).exec(),
                this.attendanceModel.countDocuments({ date: today, status: 'absent' }).exec(),
                this.paymentModel.aggregate([
                    {
                        $match: {
                            status: { $in: ['pending', 'overdue'] },
                        },
                    },
                    {
                        $group: {
                            _id: null,
                            count: { $sum: 1 },
                            amount: { $sum: '$amount' },
                        },
                    },
                ]).exec(),
                this.paymentModel.aggregate([
                    {
                        $match: {
                            status: { $regex: /^paid$/i },
                        },
                    },
                    {
                        $group: {
                            _id: null,
                            count: { $sum: 1 },
                            amount: { $sum: '$amount' },
                        },
                    },
                ]).exec(),
            ]);
            const pending = pendingPayments[0] ?? { count: 0, amount: 0 };
            const paid = paidPayments[0] ?? { count: 0, amount: 0 };
            return {
                totalStudents,
                totalTeachers,
                totalModules,
                totalRevenue: paid.amount,
                paidRevenue: paid.amount,
                totalPaid: paid.amount,
                paidPayments: {
                    count: paid.count,
                    amount: paid.amount,
                },
                todayAttendance: {
                    date: today,
                    present,
                    absent,
                    total: present + absent,
                },
                pendingPayments: {
                    count: pending.count,
                    amount: pending.amount,
                },
            };
        }
        catch {
            throw new common_1.InternalServerErrorException('Failed to load dashboard summary');
        }
    }
    async getRevenue() {
        try {
            const result = await this.paymentModel.aggregate([
                {
                    $match: {
                        status: { $regex: /^paid$/i },
                    },
                },
                {
                    $group: {
                        _id: null,
                        totalRevenue: { $sum: '$amount' },
                    },
                },
            ]).exec();
            return {
                totalRevenue: result[0]?.totalRevenue || 0,
            };
        }
        catch {
            throw new common_1.InternalServerErrorException('Failed to load revenue');
        }
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(student_schema_1.Student.name)),
    __param(1, (0, mongoose_1.InjectModel)(teacher_schema_1.Teacher.name)),
    __param(2, (0, mongoose_1.InjectModel)(module_schema_1.Module.name)),
    __param(3, (0, mongoose_1.InjectModel)(attendance_schema_1.Attendance.name)),
    __param(4, (0, mongoose_1.InjectModel)(payment_schema_1.Payment.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map