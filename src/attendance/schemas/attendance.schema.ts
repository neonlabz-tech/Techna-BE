import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AttendanceDocument = HydratedDocument<Attendance>;

@Schema({ timestamps: true })
export class Attendance {
  @Prop({ required: true })
  studentId: string;

  @Prop({ required: true })
  moduleId: string;

  @Prop({ required: true })
  moduleName: string;

  @Prop({ required: true })
  date: string;

  @Prop({ required: true, enum: ['present', 'absent'] })
  status: 'present' | 'absent';

  @Prop({ required: true })
  markedAt: string;
}

export const AttendanceSchema = SchemaFactory.createForClass(Attendance);