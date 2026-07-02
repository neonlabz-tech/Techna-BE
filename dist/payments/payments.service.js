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
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const payment_schema_1 = require("./schemas/payment.schema");
const student_schema_1 = require("../students/schemas/student.schema");
const module_schema_1 = require("../modules/schemas/module.schema");
const notifications_service_1 = require("../notifications/notifications.service");
let PaymentsService = class PaymentsService {
    constructor(paymentModel, studentModel, moduleModel, notificationsService) {
        this.paymentModel = paymentModel;
        this.studentModel = studentModel;
        this.moduleModel = moduleModel;
        this.notificationsService = notificationsService;
    }
    async findAll() {
        const list = await this.paymentModel
            .find()
            .sort({ paidDate: -1, createdAt: -1 })
            .lean();
        const missing = list.filter(p => !p.studentCode);
        if (missing.length > 0) {
            const ids = [...new Set(missing.map(p => p.studentId))];
            const orConditions = ids.flatMap(id => {
                const cond = [{ studentId: id }];
                if (mongoose_2.Types.ObjectId.isValid(id))
                    cond.push({ _id: new mongoose_2.Types.ObjectId(id) });
                return cond;
            });
            const students = await this.studentModel
                .find({ $or: orConditions })
                .select('_id studentId')
                .lean();
            const codeMap = new Map();
            students.forEach(s => codeMap.set(s._id.toString(), s.studentId));
            missing.forEach(p => { p.studentCode = codeMap.get(p.studentId) ?? ''; });
        }
        return list;
    }
    async findByStudent(studentId) {
        return this.paymentModel
            .find({ studentId })
            .sort({ paidDate: -1, createdAt: -1 })
            .lean();
    }
    async create(data) {
        const paidDate = this.normalizeDate(data.paidDate);
        const paidMonth = this.getMonthKey(paidDate);
        await this.ensureNoDuplicateMonthlyPayment(data.studentId, data.moduleId, paidMonth);
        const student = await this.resolveStudent(data.studentId);
        const module = await this.resolveModule(data.moduleId, data.moduleName);
        const receiptNo = data.receiptNo?.trim() || (await this.generateUniqueReceiptNo());
        await this.ensureReceiptNoUnique(receiptNo);
        const payment = await this.paymentModel.create({
            studentId: data.studentId,
            studentCode: student.studentId,
            studentName: data.studentName?.trim() || student.name,
            moduleId: data.moduleId,
            moduleName: data.moduleName?.trim() || module.name,
            amount: data.amount,
            paidDate,
            method: data.method,
            status: data.status || 'paid',
            receiptNo,
            batch: data.batch,
            notes: data.notes,
        });
        if (payment.status === 'paid') {
            void this.notificationsService.notifyPaymentConfirmed({
                studentId: data.studentId,
                studentName: data.studentName?.trim() || student.name,
                moduleName: data.moduleName?.trim() || module.name,
                amount: data.amount,
                receiptNo,
                paidDate,
            });
        }
        return this.toPaymentRecord(payment);
    }
    async update(id, dto) {
        const existing = await this.paymentModel.findById(id).lean();
        if (!existing)
            throw new common_1.NotFoundException('Payment not found');
        const payment = await this.paymentModel.findByIdAndUpdate(id, dto, { new: true }).lean();
        if (!payment)
            throw new common_1.NotFoundException('Payment not found');
        if (dto.status && dto.status !== existing.status) {
            if (dto.status === 'paid') {
                void this.notificationsService.notifyPaymentConfirmed({
                    studentId: payment.studentId,
                    studentName: payment.studentName,
                    moduleName: payment.moduleName,
                    amount: payment.amount,
                    receiptNo: payment.receiptNo,
                    paidDate: payment.paidDate,
                });
            }
            else if (dto.status === 'overdue') {
                void this.notificationsService.notifyPaymentReminder({
                    studentId: payment.studentId,
                    moduleName: payment.moduleName,
                    message: `Your payment of Rs. ${payment.amount} for ${payment.moduleName} is now overdue. Please settle it at your earliest convenience.`,
                });
            }
            else if (dto.status === 'pending') {
                void this.notificationsService.notifyPaymentReminder({
                    studentId: payment.studentId,
                    moduleName: payment.moduleName,
                    message: `Your payment of Rs. ${payment.amount} for ${payment.moduleName} is pending. Please complete the payment soon.`,
                });
            }
        }
        return this.toPaymentRecord(payment);
    }
    async getStudentTracking(studentId, query) {
        const year = query.year ?? new Date().getFullYear();
        const range = this.resolveMonthRange(year, query.from, query.to);
        const payments = await this.queryPayments(studentId, query.moduleId, range);
        const paidMonths = Array.from(new Set(payments
            .filter((payment) => payment.status === 'paid')
            .map((payment) => this.getMonthKey(payment.paidDate)))).sort();
        const pendingMonths = range.months.filter((month) => !paidMonths.includes(month));
        return {
            success: true,
            studentId,
            year,
            ...(query.moduleId ? { moduleId: query.moduleId } : {}),
            paidMonths,
            pendingMonths,
            payments,
        };
    }
    async queryPayments(studentId, moduleId, range) {
        const payments = await this.paymentModel
            .find({
            studentId,
            ...(moduleId ? { moduleId } : {}),
            paidDate: {
                $gte: `${range.from}-01`,
                $lte: `${range.to}-31`,
            },
        })
            .sort({ paidDate: -1, createdAt: -1 })
            .lean();
        return payments.map((payment) => this.toPaymentRecord(payment));
    }
    async resolveStudent(studentId) {
        const conditions = [{ studentId }];
        if (mongoose_2.Types.ObjectId.isValid(studentId)) {
            conditions.unshift({ _id: studentId });
        }
        const student = await this.studentModel
            .findOne({ $or: conditions })
            .lean();
        if (!student) {
            throw new common_1.NotFoundException('Student not found');
        }
        return student;
    }
    async resolveModule(moduleId, moduleName) {
        let module = null;
        if (mongoose_2.Types.ObjectId.isValid(moduleId)) {
            module = await this.moduleModel.findById(moduleId).lean();
        }
        if (!module) {
            module = await this.moduleModel.findOne({ moduleId }).lean();
        }
        if (!module && moduleName?.trim()) {
            module = await this.moduleModel.findOne({ name: moduleName.trim() }).lean();
        }
        if (!module) {
            throw new common_1.NotFoundException('Module not found');
        }
        return module;
    }
    async ensureNoDuplicateMonthlyPayment(studentId, moduleId, paidMonth) {
        const existing = await this.paymentModel.findOne({
            studentId,
            moduleId,
            paidDate: new RegExp(`^${paidMonth}-`),
        });
        if (existing) {
            throw new common_1.ConflictException('Payment already exists for this student, module, and month');
        }
    }
    async ensureReceiptNoUnique(receiptNo) {
        const existing = await this.paymentModel.findOne({ receiptNo }).lean();
        if (existing) {
            throw new common_1.ConflictException('receiptNo already exists');
        }
    }
    async generateUniqueReceiptNo() {
        for (let attempt = 0; attempt < 5; attempt += 1) {
            const now = new Date();
            const datePart = now.toISOString().slice(0, 10).replace(/-/g, '');
            const timePart = now.toTimeString().slice(0, 8).replace(/:/g, '');
            const randPart = Math.floor(Math.random() * 900 + 100).toString();
            const receiptNo = `RCP-${datePart}-${timePart}-${randPart}`;
            const existing = await this.paymentModel.findOne({ receiptNo }).lean();
            if (!existing) {
                return receiptNo;
            }
        }
        throw new common_1.BadRequestException('Unable to generate unique receipt number');
    }
    resolveMonthRange(year, from, to) {
        if (from && to) {
            return {
                from,
                to,
                months: this.buildMonthList(from, to),
            };
        }
        const start = `${year}-01`;
        const end = `${year}-12`;
        return {
            from: start,
            to: end,
            months: this.buildMonthList(start, end),
        };
    }
    buildMonthList(from, to) {
        const start = this.parseMonth(from);
        const end = this.parseMonth(to);
        if (start.getTime() > end.getTime()) {
            throw new common_1.BadRequestException('from must be before or equal to to');
        }
        const months = [];
        const cursor = new Date(start.getFullYear(), start.getMonth(), 1);
        while (cursor <= end) {
            months.push(this.formatMonth(cursor));
            cursor.setMonth(cursor.getMonth() + 1);
        }
        return months;
    }
    parseMonth(value) {
        if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(value)) {
            throw new common_1.BadRequestException('Month values must be in YYYY-MM format');
        }
        const [year, month] = value.split('-').map(Number);
        return new Date(year, month - 1, 1);
    }
    getMonthKey(dateValue) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
            throw new common_1.BadRequestException('paidDate must be in YYYY-MM-DD format');
        }
        return dateValue.slice(0, 7);
    }
    normalizeDate(dateValue) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
            throw new common_1.BadRequestException('paidDate must be in YYYY-MM-DD format');
        }
        return dateValue;
    }
    formatMonth(date) {
        const year = date.getFullYear();
        const month = `${date.getMonth() + 1}`.padStart(2, '0');
        return `${year}-${month}`;
    }
    toPaymentRecord(payment) {
        return {
            id: payment._id?.toString?.() ?? payment._id,
            studentId: payment.studentId,
            studentCode: payment.studentCode,
            studentName: payment.studentName,
            moduleId: payment.moduleId,
            moduleName: payment.moduleName,
            amount: payment.amount,
            paidDate: payment.paidDate,
            method: payment.method,
            status: payment.status,
            receiptNo: payment.receiptNo,
            batch: payment.batch,
            notes: payment.notes,
            createdAt: payment.createdAt,
            updatedAt: payment.updatedAt,
        };
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(payment_schema_1.Payment.name)),
    __param(1, (0, mongoose_1.InjectModel)(student_schema_1.Student.name)),
    __param(2, (0, mongoose_1.InjectModel)(module_schema_1.Module.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        notifications_service_1.NotificationsService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map