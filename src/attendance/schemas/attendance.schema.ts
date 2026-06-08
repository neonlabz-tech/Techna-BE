import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AttendanceDocument = HydratedDocument<Attendance>;

@Schema({ timestamps: true })
export class Attendance {
  @Prop({ required: true })
  studentId!: string;

  @Prop({ required: true })
  moduleId!: string;

  @Prop({ required: true })
  moduleName!: string;

  @Prop({ required: true })
  date!: string;

  @Prop({ required: true, enum: ['present', 'absent'] })
  status!: 'present' | 'absent';

  @Prop({ required: true })
  markedAt!: string;

  @Prop()
  sessionDate?: string;
}

export const AttendanceSchema = SchemaFactory.createForClass(Attendance);

// Database-level duplicate prevention: one record per student/module/day.
// sparse:true excludes pre-existing records that lack sessionDate.
AttendanceSchema.index(
  { studentId: 1, moduleId: 1, sessionDate: 1 },
  { unique: true, sparse: true, name: 'unique_attendance_per_session' },
);
