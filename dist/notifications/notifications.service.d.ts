import { Model } from 'mongoose';
import { Notification, NotificationDocument, NotificationType } from './schemas/notification.schema';
import { NotificationQueryDto } from './dto/notification-query.dto';
import { NotificationsGateway } from './notifications.gateway';
export declare class NotificationsService {
    private readonly notificationModel;
    private readonly studentModel;
    private readonly gateway;
    private readonly logger;
    constructor(notificationModel: Model<NotificationDocument>, studentModel: Model<any>, gateway: NotificationsGateway);
    notifyExamNotice(examNotice: {
        _id?: string;
        title: string;
        moduleName: string;
        moduleId: string;
        batch: string;
        date: string;
        startTime: string;
        endTime: string;
        venue: string;
    }): Promise<import("mongoose").Document<unknown, {}, Notification, {}, import("mongoose").DefaultSchemaOptions> & Notification & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    notifyPaymentConfirmed(payment: {
        studentId: string;
        studentName: string;
        moduleName: string;
        amount: number;
        receiptNo: string;
        paidDate: string;
    }): Promise<import("mongoose").Document<unknown, {}, Notification, {}, import("mongoose").DefaultSchemaOptions> & Notification & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    notifyPaymentReminder(data: {
        studentId?: string;
        batch?: string;
        moduleName: string;
        message: string;
    }): Promise<import("mongoose").Document<unknown, {}, Notification, {}, import("mongoose").DefaultSchemaOptions> & Notification & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    notifyResultPublished(data: {
        title: string;
        moduleName: string;
        moduleId?: string;
        batch?: string;
    }): Promise<import("mongoose").Document<unknown, {}, Notification, {}, import("mongoose").DefaultSchemaOptions> & Notification & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    notifyRegistrationApproved(student: {
        _id: string;
        studentId: string;
        fullNameEnglish?: string;
        email: string;
    }): Promise<import("mongoose").Document<unknown, {}, Notification, {}, import("mongoose").DefaultSchemaOptions> & Notification & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    notifySystem(data: {
        title: string;
        message: string;
        batch?: string;
        target?: string;
        type?: NotificationType;
        metadata?: Record<string, any>;
    }): Promise<import("mongoose").Document<unknown, {}, Notification, {}, import("mongoose").DefaultSchemaOptions> & Notification & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    getStudentNotifications(studentId: string, query: NotificationQueryDto): Promise<{
        notifications: {
            isRead: boolean;
            _id: import("mongoose").Types.ObjectId;
            $locals: Record<string, unknown>;
            $op: "save" | "validate" | "remove" | null;
            $where: Record<string, unknown>;
            baseModelName?: string;
            collection: import("mongoose").Collection;
            db: import("mongoose").Connection;
            errors?: import("mongoose").Error.ValidationError;
            isNew: boolean;
            schema: import("mongoose").Schema;
            title: string;
            message: string;
            type: NotificationType;
            target: string;
            moduleId?: string;
            moduleName?: string;
            batch?: string;
            readBy: string[];
            referenceId?: string;
            metadata?: Record<string, any>;
            createdBy: string;
            __v: number;
            id: string;
        }[];
        total: number;
        unreadCount: number;
    }>;
    getStudentUnreadCount(studentId: string): Promise<number>;
    markAsRead(notificationId: string, studentId: string): Promise<{
        message: string;
    }>;
    markAllAsRead(studentId: string): Promise<{
        message: string;
    }>;
    private createAndSend;
    private emitToStudents;
    private buildStudentFilter;
}
