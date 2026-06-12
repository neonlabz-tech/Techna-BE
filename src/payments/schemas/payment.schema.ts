import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PaymentDocument = HydratedDocument<Payment>;

@Schema({ timestamps: true })
export class Payment {
  @Prop({ required: true })
  studentId: string;

  @Prop({ required: true })
  studentName: string;

  @Prop({ required: true })
  moduleId: string;

  @Prop({ required: true })
  moduleName: string;

  @Prop({ required: true, min: 0 })
  amount: number;

  @Prop({ required: true })
  paidDate: string;

  @Prop({ required: true, enum: ['cash', 'bank', 'online'] })
  method: 'cash' | 'bank' | 'online';

  @Prop({
    required: true,
    enum: ['paid', 'pending', 'overdue'],
    default: 'paid',
  })
  status: 'paid' | 'pending' | 'overdue';

  @Prop({ required: true, unique: true })
  receiptNo: string;

  @Prop({ required: true })
  batch: string;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
