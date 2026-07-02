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
var NotificationsAutoService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsAutoService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const schedule_1 = require("@nestjs/schedule");
const notifications_service_1 = require("./notifications.service");
const notifications_gateway_1 = require("./notifications.gateway");
const notification_schema_1 = require("./schemas/notification.schema");
let NotificationsAutoService = NotificationsAutoService_1 = class NotificationsAutoService {
    constructor(notificationsService, gateway, notificationModel, studentModel, paymentModel, examNoticeModel) {
        this.notificationsService = notificationsService;
        this.gateway = gateway;
        this.notificationModel = notificationModel;
        this.studentModel = studentModel;
        this.paymentModel = paymentModel;
        this.examNoticeModel = examNoticeModel;
        this.logger = new common_1.Logger(NotificationsAutoService_1.name);
    }
    async onModuleInit() {
        this.logger.log('Auto-notification service initialized');
        this.gateway.registerStudentLoginHandler((studentId) => {
            void this.onStudentLogin(studentId);
        });
        void this.checkUpcomingExams();
        void this.checkOverduePayments();
    }
    async checkUpcomingExams() {
        try {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            const tomorrowStr = tomorrow.toISOString().slice(0, 10);
            const upcomingExams = await this.examNoticeModel
                .find({ isPublished: true, date: tomorrowStr })
                .lean();
            for (const exam of upcomingExams) {
                const exists = await this.notificationModel.findOne({
                    referenceId: exam._id.toString(),
                    type: notification_schema_1.NotificationType.EXAM_NOTICE,
                    'metadata.isReminder': true,
                });
                if (!exists) {
                    await this.notificationsService.notifySystem({
                        title: `⏰ Exam Tomorrow: ${exam.title}`,
                        message: `Reminder: Your exam for ${exam.moduleName} is tomorrow (${exam.date}) from ${exam.startTime} to ${exam.endTime} at ${exam.venue}. Good luck!`,
                        type: notification_schema_1.NotificationType.EXAM_NOTICE,
                        target: exam.batch || 'all',
                        batch: exam.batch,
                        metadata: {
                            isReminder: true,
                            referenceId: exam._id.toString(),
                            date: exam.date,
                            startTime: exam.startTime,
                            endTime: exam.endTime,
                            venue: exam.venue,
                        },
                    });
                    this.logger.log(`Sent exam reminder: ${exam.title} (${exam.batch})`);
                }
            }
        }
        catch (error) {
            this.logger.error('Failed to check upcoming exams', error);
        }
    }
    async checkOverduePayments() {
        try {
            const overduePayments = await this.paymentModel
                .find({ status: 'overdue' })
                .lean();
            const studentPayments = new Map();
            for (const payment of overduePayments) {
                const key = payment.studentId;
                if (!studentPayments.has(key)) {
                    studentPayments.set(key, []);
                }
                studentPayments.get(key).push(payment);
            }
            for (const [studentId, payments] of studentPayments) {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const alreadySent = await this.notificationModel.findOne({
                    target: studentId,
                    type: notification_schema_1.NotificationType.PAYMENT_REMINDER,
                    createdAt: { $gte: today },
                });
                if (!alreadySent) {
                    const moduleNames = payments.map((p) => p.moduleName).join(', ');
                    const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);
                    await this.notificationsService.notifyPaymentReminder({
                        studentId,
                        moduleName: moduleNames,
                        message: `You have ${payments.length} overdue payment(s) totalling Rs. ${totalAmount}. Modules: ${moduleNames}. Please settle at your earliest convenience.`,
                    });
                    this.logger.log(`Sent overdue reminder to student: ${studentId}`);
                }
            }
        }
        catch (error) {
            this.logger.error('Failed to check overdue payments', error);
        }
    }
    async sendWeeklySummary() {
        try {
            const startStr = new Date().toISOString().slice(0, 10);
            const endDate = new Date();
            endDate.setDate(endDate.getDate() + 7);
            const endStr = endDate.toISOString().slice(0, 10);
            const upcomingExams = await this.examNoticeModel
                .find({ isPublished: true, date: { $gte: startStr, $lte: endStr } })
                .lean();
            if (upcomingExams.length === 0)
                return;
            const batchExams = new Map();
            for (const exam of upcomingExams) {
                if (!batchExams.has(exam.batch)) {
                    batchExams.set(exam.batch, []);
                }
                batchExams.get(exam.batch).push(exam);
            }
            for (const [batch, exams] of batchExams) {
                const examList = exams
                    .map((e) => `• ${e.moduleName} on ${e.date} at ${e.venue}`)
                    .join('\n');
                await this.notificationsService.notifySystem({
                    title: '📅 Weekly Schedule',
                    message: `You have ${exams.length} exam(s) this week:\n${examList}`,
                    target: batch,
                    batch,
                    metadata: { isWeeklySummary: true, examCount: exams.length },
                });
            }
            this.logger.log('Sent weekly summary notifications');
        }
        catch (error) {
            this.logger.error('Failed to send weekly summary', error);
        }
    }
    async onStudentLogin(studentId) {
        try {
            const student = await this.studentModel
                .findById(studentId)
                .select('studentId fullNameEnglish batch')
                .lean();
            if (!student)
                return;
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const alreadySent = await this.notificationModel.findOne({
                target: studentId,
                'metadata.isLoginWelcome': true,
                createdAt: { $gte: today },
            });
            if (alreadySent)
                return;
            const [unreadCount, overduePayments, upcomingExams] = await Promise.all([
                this.getUnreadCount(studentId, student.batch),
                this.getOverduePaymentCount(studentId),
                this.getUpcomingExamCount(student.batch),
            ]);
            const parts = [];
            if (unreadCount > 0)
                parts.push(`${unreadCount} unread notification(s)`);
            if (overduePayments > 0)
                parts.push(`${overduePayments} overdue payment(s)`);
            if (upcomingExams > 0)
                parts.push(`${upcomingExams} upcoming exam(s) this week`);
            const summary = parts.length > 0
                ? `You have: ${parts.join(', ')}.`
                : 'You\'re all caught up! No pending items.';
            const name = student.fullNameEnglish || 'Student';
            const firstName = name.split(' ')[0];
            await this.notificationsService.notifySystem({
                title: `👋 Welcome back, ${firstName}!`,
                message: summary,
                target: studentId,
                metadata: {
                    isLoginWelcome: true,
                    unreadCount,
                    overduePayments,
                    upcomingExams,
                },
            });
        }
        catch (error) {
            this.logger.error(`Login notification failed for ${studentId}`, error);
        }
    }
    async onStudentApproved(student) {
        try {
            await this.notificationsService.notifySystem({
                title: '🎉 Welcome to Techna!',
                message: `Welcome ${student.fullNameEnglish || 'Student'}! Your Student ID is ${student.studentId}. You can now view exam schedules, track payments, and receive important updates automatically.`,
                target: student._id.toString(),
                batch: student.batch,
                metadata: { isWelcome: true, studentId: student.studentId },
            });
            this.logger.log(`Sent welcome notification to ${student.studentId}`);
        }
        catch (error) {
            this.logger.error(`Welcome notification failed for ${student.studentId}`, error);
        }
    }
    async getUnreadCount(studentId, batch) {
        const filter = {
            $or: [{ target: 'all' }, { target: studentId }],
            readBy: { $ne: studentId },
        };
        if (batch) {
            filter.$or.push({ target: batch }, { batch });
        }
        return this.notificationModel.countDocuments(filter);
    }
    async getOverduePaymentCount(studentId) {
        return this.paymentModel.countDocuments({ studentId, status: 'overdue' });
    }
    async getUpcomingExamCount(batch) {
        if (!batch)
            return 0;
        const now = new Date().toISOString().slice(0, 10);
        const weekLater = new Date();
        weekLater.setDate(weekLater.getDate() + 7);
        return this.examNoticeModel.countDocuments({
            isPublished: true,
            batch,
            date: { $gte: now, $lte: weekLater.toISOString().slice(0, 10) },
        });
    }
};
exports.NotificationsAutoService = NotificationsAutoService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_8AM),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], NotificationsAutoService.prototype, "checkUpcomingExams", null);
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_9AM),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], NotificationsAutoService.prototype, "checkOverduePayments", null);
__decorate([
    (0, schedule_1.Cron)('0 30 8 * * 1'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], NotificationsAutoService.prototype, "sendWeeklySummary", null);
exports.NotificationsAutoService = NotificationsAutoService = NotificationsAutoService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, mongoose_1.InjectModel)(notification_schema_1.Notification.name)),
    __param(3, (0, mongoose_1.InjectModel)('Student')),
    __param(4, (0, mongoose_1.InjectModel)('Payment')),
    __param(5, (0, mongoose_1.InjectModel)('ExamNotice')),
    __metadata("design:paramtypes", [notifications_service_1.NotificationsService,
        notifications_gateway_1.NotificationsGateway,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], NotificationsAutoService);
//# sourceMappingURL=notifications-auto.service.js.map