import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PaymentDocument = HydratedDocument<Payment>;

@Schema({ timestamps: true })
export class Payment {
  @Prop({ required: true })
  studentId!: string;

  @Prop()
  studentCode?: string;

  @Prop({ required: true })
  studentName!: string;

  // 'subject' payments only — Admission/ID Card fees are NOT subjects,
  // so they don't get (or need) a real moduleId.
  @Prop()
  moduleId?: string;

  @Prop({ required: true })
  moduleName!: string;

  // 'subject'   -> recurring, tracked monthly, unique per (student, moduleId, month)
  // 'admission' | 'idcard' -> one-time fee, never treated as a subject
  @Prop({ required: true, enum: ['subject', 'admission', 'idcard'], default: 'subject' })
  feeType!: 'subject' | 'admission' | 'idcard';

  @Prop({ required: true, min: 0 })
  amount!: number;

  @Prop({ required: true })
  paidDate!: string;

  @Prop({ required: true, enum: ['cash', 'bank', 'online'] })
  method!: 'cash' | 'bank' | 'online';

  @Prop({ required: true, enum: ['paid', 'pending', 'overdue'], default: 'paid' })
  status!: 'paid' | 'pending' | 'overdue';

  @Prop({ required: true, unique: true })
  receiptNo!: string;

  @Prop({ required: true })
  batch!: string;

  @Prop()
  notes?: string;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);