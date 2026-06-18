import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  Request,
  Patch,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../enums/role.enum';

import { NotificationsService } from './notifications.service';
import { NotificationQueryDto } from './dto/notification-query.dto';

/**
 * Notification Controller — STUDENT ONLY
 *
 * Students receive notifications automatically from the backend.
 * No admin/teacher endpoints needed. All notifications are system-generated.
 */
@ApiTags('Notifications')
@ApiBearerAuth('access-token')
@Controller('notifications')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.STUDENT)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  /**
   * GET /api/notifications/my
   * Get all notifications for the logged-in student.
   */
  @Get('my')
  @ApiOperation({ summary: 'Get notifications for logged-in student' })
  async getMyNotifications(@Request() req: any, @Query() query: NotificationQueryDto) {
    return this.notificationsService.getStudentNotifications(req.user.userId, query);
  }

  /**
   * GET /api/notifications/unread-count
   * Get unread notification count.
   */
  @Get('unread-count')
  @ApiOperation({ summary: 'Get unread notification count' })
  async getUnreadCount(@Request() req: any) {
    const count = await this.notificationsService.getStudentUnreadCount(req.user.userId);
    return { unreadCount: count };
  }

  /**
   * PATCH /api/notifications/:id/read
   * Mark a notification as read.
   */
  @Patch(':id/read')
  @ApiOperation({ summary: 'Mark notification as read' })
  async markAsRead(@Param('id') id: string, @Request() req: any) {
    return this.notificationsService.markAsRead(id, req.user.userId);
  }

  /**
   * PATCH /api/notifications/mark-all-read
   * Mark all notifications as read.
   */
  @Patch('mark-all-read')
  @ApiOperation({ summary: 'Mark all notifications as read' })
  async markAllAsRead(@Request() req: any) {
    return this.notificationsService.markAllAsRead(req.user.userId);
  }
}
