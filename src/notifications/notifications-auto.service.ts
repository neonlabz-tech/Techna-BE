import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';

import { NotificationsService } from './notifications.service';
import { NotificationsGateway } from './notifications.gateway';
import {
  Notification,
  NotificationDocument,
  NotificationType,
} from './schemas/notification.schema';

/**
 * Automatic Notification Generator — No Admin Involvement
 *
 * This service automatically generates and sends notifications to students:
 *
 * 1. Exam reminders (24h before exam)
 * 2. Overdue payment reminders (daily check)
 * 3. Weekly summary (every Monday)
 * 4. Welcome-back summary on Socket.IO connect
 * 5. Welcome notification on approval
 */
@Injectable()
export class NotificationsAutoService implements OnModuleInit {
  private readonly logger = new Logger(NotificationsAutoService.name);

  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly gateway: NotificationsGateway,
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<NotificationDocument>,
    @InjectModel('Student') private readonly studentModel: Model<any>,
    @InjectModel('Payment') private readonly paymentModel: Model<any>,
    @InjectModel('ExamNotice') private readonly examNoticeModel: Model<any>,
  ) {}

  async onModuleInit() {
    this.logger.log('Auto-notification service initialized');

    // Register login handler so students get welcome notification on connect
    this.gateway.registerStudentLoginHandler((studentId: string) => {
      void this.onStudentLogin(studentId);
    });

    // Run initial checks on startup
    void this.checkUpcomingExams();
    void this.checkOverduePayments();
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // SCHEDULED JOBS
  // ═══════════════════════════════════════════════════════════════════════════════

  /**
   * Every day at 8:00 AM — check exams happening tomorrow, send reminders.
   */
  @Cron(CronExpression.EVERY_DAY_AT_8AM)
  async checkUpcomingExams() {
    try {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().slice(0, 10);

      const upcomingExams = await this.examNoticeModel
        .find({ isPublished: true, date: tomorrowStr })
        .lean();

      for (const exam of upcomingExams) {
        // Avoid duplicate reminders
        const exists = await this.notificationModel.findOne({
          referenceId: exam._id.toString(),
          type: NotificationType.EXAM_NOTICE,
          'metadata.isReminder': true,
        });

        if (!exists) {
          await this.notificationsService.notifySystem({
            title: `⏰ Exam Tomorrow: ${exam.title}`,
            message: `Reminder: Your exam for ${exam.moduleName} is tomorrow (${exam.date}) from ${exam.startTime} to ${exam.endTime} at ${exam.venue}. Good luck!`,
            type: NotificationType.EXAM_NOTICE,
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
    } catch (error) {
      this.logger.error('Failed to check upcoming exams', error);
    }
  }

  /**
   * Every day at 9:00 AM — check overdue payments, send reminders.
   */
  @Cron(CronExpression.EVERY_DAY_AT_9AM)
  async checkOverduePayments() {
    try {
      const overduePayments = await this.paymentModel
        .find({ status: 'overdue' })
        .lean();

      // Group by student
      const studentPayments = new Map<string, any[]>();
      for (const payment of overduePayments) {
        const key = payment.studentId;
        if (!studentPayments.has(key)) {
          studentPayments.set(key, []);
        }
        studentPayments.get(key)!.push(payment);
      }

      for (const [studentId, payments] of studentPayments) {
        // Only one reminder per student per day
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const alreadySent = await this.notificationModel.findOne({
          target: studentId,
          type: NotificationType.PAYMENT_REMINDER,
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
    } catch (error) {
      this.logger.error('Failed to check overdue payments', error);
    }
  }

  /**
   * Every Monday at 8:30 AM — send weekly summary to batches with upcoming exams.
   */
  @Cron('0 30 8 * * 1')
  async sendWeeklySummary() {
    try {
      const startStr = new Date().toISOString().slice(0, 10);
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 7);
      const endStr = endDate.toISOString().slice(0, 10);

      const upcomingExams = await this.examNoticeModel
        .find({ isPublished: true, date: { $gte: startStr, $lte: endStr } })
        .lean();

      if (upcomingExams.length === 0) return;

      // Group by batch
      const batchExams = new Map<string, any[]>();
      for (const exam of upcomingExams) {
        if (!batchExams.has(exam.batch)) {
          batchExams.set(exam.batch, []);
        }
        batchExams.get(exam.batch)!.push(exam);
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
    } catch (error) {
      this.logger.error('Failed to send weekly summary', error);
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // EVENT-DRIVEN (triggered by system actions)
  // ═══════════════════════════════════════════════════════════════════════════════

  /**
   * Called when a student connects via Socket.IO after login.
   * Sends a personalized summary notification.
   */
  async onStudentLogin(studentId: string) {
    try {
      const student = await this.studentModel
        .findById(studentId)
        .select('studentId fullNameEnglish batch')
        .lean();

      if (!student) return;

      // Only one login notification per day
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const alreadySent = await this.notificationModel.findOne({
        target: studentId,
        'metadata.isLoginWelcome': true,
        createdAt: { $gte: today },
      });

      if (alreadySent) return;

      // Gather pending info
      const [unreadCount, overduePayments, upcomingExams] = await Promise.all([
        this.getUnreadCount(studentId, student.batch),
        this.getOverduePaymentCount(studentId),
        this.getUpcomingExamCount(student.batch),
      ]);

      // Build summary
      const parts: string[] = [];
      if (unreadCount > 0) parts.push(`${unreadCount} unread notification(s)`);
      if (overduePayments > 0) parts.push(`${overduePayments} overdue payment(s)`);
      if (upcomingExams > 0) parts.push(`${upcomingExams} upcoming exam(s) this week`);

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
    } catch (error) {
      this.logger.error(`Login notification failed for ${studentId}`, error);
    }
  }

  /**
   * Called when a student registration is approved.
   * Sends a welcome notification with onboarding info.
   */
  async onStudentApproved(student: {
    _id: string;
    studentId: string;
    fullNameEnglish?: string;
    batch?: string;
  }) {
    try {
      await this.notificationsService.notifySystem({
        title: '🎉 Welcome to Techna!',
        message: `Welcome ${student.fullNameEnglish || 'Student'}! Your Student ID is ${student.studentId}. You can now view exam schedules, track payments, and receive important updates automatically.`,
        target: student._id.toString(),
        batch: student.batch,
        metadata: { isWelcome: true, studentId: student.studentId },
      });

      this.logger.log(`Sent welcome notification to ${student.studentId}`);
    } catch (error) {
      this.logger.error(`Welcome notification failed for ${student.studentId}`, error);
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // PRIVATE HELPERS
  // ═══════════════════════════════════════════════════════════════════════════════

  private async getUnreadCount(studentId: string, batch?: string): Promise<number> {
    const filter: any = {
      $or: [{ target: 'all' }, { target: studentId }],
      readBy: { $ne: studentId },
    };
    if (batch) {
      filter.$or.push({ target: batch }, { batch });
    }
    return this.notificationModel.countDocuments(filter);
  }

  private async getOverduePaymentCount(studentId: string): Promise<number> {
    return this.paymentModel.countDocuments({ studentId, status: 'overdue' });
  }

  private async getUpcomingExamCount(batch?: string): Promise<number> {
    if (!batch) return 0;
    const now = new Date().toISOString().slice(0, 10);
    const weekLater = new Date();
    weekLater.setDate(weekLater.getDate() + 7);
    return this.examNoticeModel.countDocuments({
      isPublished: true,
      batch,
      date: { $gte: now, $lte: weekLater.toISOString().slice(0, 10) },
    });
  }
}
