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
var NotificationsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const notification_schema_1 = require("./schemas/notification.schema");
const notifications_gateway_1 = require("./notifications.gateway");
let NotificationsService = NotificationsService_1 = class NotificationsService {
    constructor(notificationModel, studentModel, gateway) {
        this.notificationModel = notificationModel;
        this.studentModel = studentModel;
        this.gateway = gateway;
        this.logger = new common_1.Logger(NotificationsService_1.name);
    }
    async notifyExamNotice(examNotice) {
        return this.createAndSend({
            title: `📝 Exam Notice: ${examNotice.title}`,
            message: `Exam for ${examNotice.moduleName} scheduled on ${examNotice.date} from ${examNotice.startTime} to ${examNotice.endTime} at ${examNotice.venue}`,
            type: notification_schema_1.NotificationType.EXAM_NOTICE,
            target: examNotice.batch || 'all',
            batch: examNotice.batch,
            moduleId: examNotice.moduleId,
            moduleName: examNotice.moduleName,
            referenceId: examNotice._id?.toString(),
            metadata: {
                date: examNotice.date,
                startTime: examNotice.startTime,
                endTime: examNotice.endTime,
                venue: examNotice.venue,
            },
        });
    }
    async notifyPaymentConfirmed(payment) {
        return this.createAndSend({
            title: '💰 Payment Confirmed',
            message: `Your payment of Rs. ${payment.amount} for ${payment.moduleName} has been confirmed. Receipt: ${payment.receiptNo}`,
            type: notification_schema_1.NotificationType.PAYMENT_CONFIRMED,
            target: payment.studentId,
            moduleName: payment.moduleName,
            referenceId: payment.receiptNo,
            metadata: {
                amount: payment.amount,
                paidDate: payment.paidDate,
                receiptNo: payment.receiptNo,
            },
        });
    }
    async notifyPaymentReminder(data) {
        return this.createAndSend({
            title: '⚠️ Payment Reminder',
            message: data.message,
            type: notification_schema_1.NotificationType.PAYMENT_REMINDER,
            target: data.studentId || data.batch || 'all',
            batch: data.batch,
            moduleName: data.moduleName,
        });
    }
    async notifyResultPublished(data) {
        return this.createAndSend({
            title: `📊 Results Published: ${data.title}`,
            message: `Results for ${data.moduleName} have been published. Check your results now.`,
            type: notification_schema_1.NotificationType.RESULT_PUBLISHED,
            target: data.batch || 'all',
            batch: data.batch,
            moduleId: data.moduleId,
            moduleName: data.moduleName,
        });
    }
    async notifyRegistrationApproved(student) {
        return this.createAndSend({
            title: '✅ Registration Approved',
            message: `Congratulations! Your registration has been approved. Student ID: ${student.studentId}. You can now access all modules and features.`,
            type: notification_schema_1.NotificationType.REGISTRATION_APPROVED,
            target: student._id.toString(),
            referenceId: student.studentId,
        });
    }
    async notifySystem(data) {
        return this.createAndSend({
            title: data.title,
            message: data.message,
            type: data.type || notification_schema_1.NotificationType.GENERAL,
            target: data.target || data.batch || 'all',
            batch: data.batch,
            metadata: data.metadata,
        });
    }
    async getStudentNotifications(studentId, query) {
        const student = await this.studentModel
            .findById(studentId)
            .select('batch')
            .lean();
        const studentBatch = student?.batch || '';
        const filter = this.buildStudentFilter(studentId, studentBatch, query);
        const [notifications, total] = await Promise.all([
            this.notificationModel
                .find(filter)
                .sort({ createdAt: -1 })
                .skip(query.skip || 0)
                .limit(query.limit || 20)
                .lean(),
            this.notificationModel.countDocuments(filter),
        ]);
        const result = notifications.map((n) => ({
            ...n,
            isRead: n.readBy?.includes(studentId) || false,
        }));
        const unreadCount = await this.notificationModel.countDocuments({
            ...this.buildStudentFilter(studentId, studentBatch),
            readBy: { $ne: studentId },
        });
        return { notifications: result, total, unreadCount };
    }
    async getStudentUnreadCount(studentId) {
        const student = await this.studentModel
            .findById(studentId)
            .select('batch')
            .lean();
        const studentBatch = student?.batch || '';
        return this.notificationModel.countDocuments({
            ...this.buildStudentFilter(studentId, studentBatch),
            readBy: { $ne: studentId },
        });
    }
    async markAsRead(notificationId, studentId) {
        const notification = await this.notificationModel.findByIdAndUpdate(notificationId, { $addToSet: { readBy: studentId } }, { new: true });
        if (!notification) {
            throw new common_1.NotFoundException('Notification not found');
        }
        return { message: 'Notification marked as read' };
    }
    async markAllAsRead(studentId) {
        const student = await this.studentModel
            .findById(studentId)
            .select('batch')
            .lean();
        const studentBatch = student?.batch || '';
        await this.notificationModel.updateMany({
            ...this.buildStudentFilter(studentId, studentBatch),
            readBy: { $ne: studentId },
        }, { $addToSet: { readBy: studentId } });
        return { message: 'All notifications marked as read' };
    }
    async createAndSend(data) {
        const notification = await this.notificationModel.create({
            ...data,
            createdBy: 'system',
        });
        const payload = notification.toObject();
        this.emitToStudents(payload);
        this.logger.log(`[Auto] ${data.type}: ${data.title} → target: ${data.target}`);
        return payload;
    }
    emitToStudents(notification) {
        const target = notification.target;
        if (target === 'all') {
            this.gateway.sendToAll(notification);
        }
        else if (notification.batch && target === notification.batch) {
            this.gateway.sendToBatch(notification.batch, notification);
        }
        else {
            this.gateway.sendToStudent(target, notification);
        }
        if (notification.moduleId) {
            this.gateway.sendToModule(notification.moduleId, notification);
        }
    }
    buildStudentFilter(studentId, studentBatch, query) {
        const filter = {
            $or: [
                { target: 'all' },
                { target: studentId },
                ...(studentBatch ? [{ target: studentBatch }, { batch: studentBatch }] : []),
            ],
        };
        if (query?.type) {
            filter.type = query.type;
        }
        if (query?.unreadOnly) {
            filter.readBy = { $ne: studentId };
        }
        return filter;
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = NotificationsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(notification_schema_1.Notification.name)),
    __param(1, (0, mongoose_1.InjectModel)('Student')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        notifications_gateway_1.NotificationsGateway])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map