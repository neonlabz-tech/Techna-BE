import { OnModuleInit } from '@nestjs/common';
import { Model } from 'mongoose';
import { NotificationsService } from './notifications.service';
import { NotificationsGateway } from './notifications.gateway';
import { NotificationDocument } from './schemas/notification.schema';
export declare class NotificationsAutoService implements OnModuleInit {
    private readonly notificationsService;
    private readonly gateway;
    private readonly notificationModel;
    private readonly studentModel;
    private readonly paymentModel;
    private readonly examNoticeModel;
    private readonly logger;
    constructor(notificationsService: NotificationsService, gateway: NotificationsGateway, notificationModel: Model<NotificationDocument>, studentModel: Model<any>, paymentModel: Model<any>, examNoticeModel: Model<any>);
    onModuleInit(): Promise<void>;
    checkUpcomingExams(): Promise<void>;
    checkOverduePayments(): Promise<void>;
    sendWeeklySummary(): Promise<void>;
    onStudentLogin(studentId: string): Promise<void>;
    onStudentApproved(student: {
        _id: string;
        studentId: string;
        fullNameEnglish?: string;
        batch?: string;
    }): Promise<void>;
    private getUnreadCount;
    private getOverduePaymentCount;
    private getUpcomingExamCount;
}
