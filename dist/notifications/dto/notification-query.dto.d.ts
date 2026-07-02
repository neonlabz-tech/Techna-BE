import { NotificationType } from '../schemas/notification.schema';
export declare class NotificationQueryDto {
    readonly type?: NotificationType;
    readonly batch?: string;
    readonly unreadOnly?: boolean;
    readonly limit?: number;
    readonly skip?: number;
}
