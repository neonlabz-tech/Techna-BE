import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  Notification,
  NotificationDocument,
  NotificationType,
} from './schemas/notification.schema';
import { NotificationQueryDto } from './dto/notification-query.dto';
import { NotificationsGateway } from './notifications.gateway';

/**
 * Notifications Service — Fully Automatic (No Admin Involvement)
 *
 * All notifications are created by the system automatically when:
 * - Exam notice is published
 * - Payment is recorded/overdue
 * - Student registration is approved/rejected
 * - Results are published
 * - Scheduled reminders (daily/weekly)
 * - Student connects after login
 *
 * Students only READ notifications. Nobody manually creates them.
 */
@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<NotificationDocument>,
    @InjectModel('Student') private readonly studentModel: Model<any>,
    private readonly gateway: NotificationsGateway,
  ) {}

  // ═══════════════════════════════════════════════════════════════════════════════
  // AUTO-GENERATED NOTIFICATIONS (called internally by other services)
  // ═══════════════════════════════════════════════════════════════════════════════

  /**
   * Exam notice published → auto-notify students in that batch.
   */
  async notifyExamNotice(examNotice: {
    _id?: string;
    title: string;
    moduleName: string;
    moduleId: string;
    batch: string;
    date: string;
    startTime: string;
    endTime: string;
    venue: string;
  }) {
    return this.createAndSend({
      title: `📝 Exam Notice: ${examNotice.title}`,
      message: `Exam for ${examNotice.moduleName} scheduled on ${examNotice.date} from ${examNotice.startTime} to ${examNotice.endTime} at ${examNotice.venue}`,
      type: NotificationType.EXAM_NOTICE,
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

  /**
   * Payment confirmed → auto-notify that student.
   */
  async notifyPaymentConfirmed(payment: {
    studentId: string;
    studentName: string;
    moduleName: string;
    amount: number;
    receiptNo: string;
    paidDate: string;
  }) {
    return this.createAndSend({
      title: '💰 Payment Confirmed',
      message: `Your payment of Rs. ${payment.amount} for ${payment.moduleName} has been confirmed. Receipt: ${payment.receiptNo}`,
      type: NotificationType.PAYMENT_CONFIRMED,
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

  /**
   * Payment overdue/reminder → auto-notify student or batch.
   */
  async notifyPaymentReminder(data: {
    studentId?: string;
    batch?: string;
    moduleName: string;
    message: string;
  }) {
    return this.createAndSend({
      title: '⚠️ Payment Reminder',
      message: data.message,
      type: NotificationType.PAYMENT_REMINDER,
      target: data.studentId || data.batch || 'all',
      batch: data.batch,
      moduleName: data.moduleName,
    });
  }

  /**
   * Results published → auto-notify students in that batch.
   */
  async notifyResultPublished(data: {
    title: string;
    moduleName: string;
    moduleId?: string;
    batch?: string;
  }) {
    return this.createAndSend({
      title: `📊 Results Published: ${data.title}`,
      message: `Results for ${data.moduleName} have been published. Check your results now.`,
      type: NotificationType.RESULT_PUBLISHED,
      target: data.batch || 'all',
      batch: data.batch,
      moduleId: data.moduleId,
      moduleName: data.moduleName,
    });
  }

  /**
   * Registration approved → auto-notify that student.
   * (Only approved students can login and see notifications)
   */
  async notifyRegistrationApproved(student: {
    _id: string;
    studentId: string;
    fullNameEnglish?: string;
    email: string;
  }) {
    return this.createAndSend({
      title: '✅ Registration Approved',
      message: `Congratulations! Your registration has been approved. Student ID: ${student.studentId}. You can now access all modules and features.`,
      type: NotificationType.REGISTRATION_APPROVED,
      target: student._id.toString(),
      referenceId: student.studentId,
    });
  }

  /**
   * General system notification → auto-send to all or a batch.
   */
  async notifySystem(data: {
    title: string;
    message: string;
    batch?: string;
    target?: string;
    type?: NotificationType;
    metadata?: Record<string, any>;
  }) {
    return this.createAndSend({
      title: data.title,
      message: data.message,
      type: data.type || NotificationType.GENERAL,
      target: data.target || data.batch || 'all',
      batch: data.batch,
      metadata: data.metadata,
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // STUDENT QUERY METHODS (used by controller)
  // ═══════════════════════════════════════════════════════════════════════════════

  /**
   * Get notifications for a student. Auto-resolves batch from student record.
   */
  async getStudentNotifications(studentId: string, query: NotificationQueryDto) {
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

  /**
   * Get unread count for a student.
   */
  async getStudentUnreadCount(studentId: string): Promise<number> {
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

  /**
   * Mark notification as read.
   */
  async markAsRead(notificationId: string, studentId: string) {
    const notification = await this.notificationModel.findByIdAndUpdate(
      notificationId,
      { $addToSet: { readBy: studentId } },
      { new: true },
    );

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    return { message: 'Notification marked as read' };
  }

  /**
   * Mark all notifications as read.
   */
  async markAllAsRead(studentId: string) {
    const student = await this.studentModel
      .findById(studentId)
      .select('batch')
      .lean();

    const studentBatch = student?.batch || '';

    await this.notificationModel.updateMany(
      {
        ...this.buildStudentFilter(studentId, studentBatch),
        readBy: { $ne: studentId },
      },
      { $addToSet: { readBy: studentId } },
    );

    return { message: 'All notifications marked as read' };
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // PRIVATE HELPERS
  // ═══════════════════════════════════════════════════════════════════════════════

  /**
   * Create notification in DB and push to student(s) via Socket.IO.
   */
  private async createAndSend(data: {
    title: string;
    message: string;
    type: NotificationType;
    target: string;
    batch?: string;
    moduleId?: string;
    moduleName?: string;
    referenceId?: string;
    metadata?: Record<string, any>;
  }) {
    const notification = await this.notificationModel.create({
      ...data,
      createdBy: 'system',
    });

    const payload = notification.toObject();
    this.emitToStudents(payload);

    this.logger.log(`[Auto] ${data.type}: ${data.title} → target: ${data.target}`);
    return payload;
  }

  /**
   * Emit notification to the correct student audience via Socket.IO.
   */
  private emitToStudents(notification: any) {
    const target = notification.target;

    if (target === 'all') {
      this.gateway.sendToAll(notification);
    } else if (notification.batch && target === notification.batch) {
      this.gateway.sendToBatch(notification.batch, notification);
    } else {
      this.gateway.sendToStudent(target, notification);
    }

    if (notification.moduleId) {
      this.gateway.sendToModule(notification.moduleId, notification);
    }
  }

  /**
   * Build MongoDB filter to find notifications relevant to a student.
   */
  private buildStudentFilter(
    studentId: string,
    studentBatch: string,
    query?: NotificationQueryDto,
  ): any {
    const filter: any = {
      $or: [
        { target: 'all' },
        { target: studentId },
        ...(studentBatch ? [{ target: studentBatch }] : []),
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
}
