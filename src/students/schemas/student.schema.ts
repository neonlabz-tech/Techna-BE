import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type StudentDocument = HydratedDocument<Student>;

@Schema({ timestamps: true })
export class Student {
  @Prop({ required: true, unique: true })
  studentId: string;

  @Prop({ required: true, unique: true })
  qrToken: string;

  @Prop()
  qrCode?: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  dob: string;

  @Prop({ required: true })
  batch: string;

  @Prop({ type: [String], default: [] })
  modules: string[];

  @Prop({ required: true, enum: ['pending', 'approved', 'rejected'], default: 'pending' })
  status: 'pending' | 'approved' | 'rejected';

  @Prop()
  avatar?: string;

  @Prop()
  parentName?: string;

  @Prop()
  parentPhone?: string;

  @Prop({ required: true })
  enrolledAt: string;

  @Prop()
  approvedAt?: string;
}

export const StudentSchema = SchemaFactory.createForClass(Student);
