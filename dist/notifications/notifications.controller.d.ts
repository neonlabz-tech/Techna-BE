import { NotificationsService } from './notifications.service';
import { NotificationQueryDto } from './dto/notification-query.dto';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    getMyNotifications(req: any, query: NotificationQueryDto): Promise<{
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
            type: import("./schemas/notification.schema").NotificationType;
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
    getUnreadCount(req: any): Promise<{
        unreadCount: number;
    }>;
    markAsRead(id: string, req: any): Promise<{
        message: string;
    }>;
    markAllAsRead(req: any): Promise<{
        message: string;
    }>;
}
