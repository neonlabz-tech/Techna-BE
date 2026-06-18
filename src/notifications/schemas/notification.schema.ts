import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type NotificationDocument = HydratedDocument<Notification>;

export enum NotificationType {
  EXAM_NOTICE = 'exam_notice',
  PAYMENT_REMINDER = 'payment_reminder',
  PAYMENT_CONFIRMED = 'payment_confirmed',
  RESULT_PUBLISHED = 'result_published',
  REGISTRATION_APPROVED = 'registration_approved',
  GENERAL = 'general',
  ATTENDANCE = 'attendance',
  TIMETABLE = 'timetable',
}

@Schema({ timestamps: true })
export class Notification {
  @Prop({ required: true })
  title!: string;

  @Prop({ required: true })
  message!: string;

  @Prop({ required: true, enum: NotificationType })
  type!: NotificationType;

  /**
   * Target audience:
   * - 'all' → every student
   * - specific batch name → students in that batch
   * - specific studentId (ObjectId) → single student
   */
  @Prop({ required: true, default: 'all' })
  target!: string;

  /** Optional: restrict to students enrolled in this module */
  @Prop()
  moduleId?: string;

  @Prop()
  moduleName?: string;

  /** Optional: batch filter */
  @Prop()
  batch?: string;

  /** Array of student ObjectIds who have read this notification */
  @Prop({ type: [String], default: [] })
  readBy!: string[];

  /** Reference ID (e.g. exam notice ID, payment ID) for linking */
  @Prop()
  referenceId?: string;

  /** Additional metadata as JSON */
  @Prop({ type: Object })
  metadata?: Record<string, any>;

  /** Who created (admin/teacher userId or 'system') */
  @Prop({ default: 'system' })
  createdBy!: string;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);

// Index for faster student queries
NotificationSchema.index({ target: 1, batch: 1, createdAt: -1 });
NotificationSchema.index({ readBy: 1 });
