import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TeacherDocument = Teacher & Document;

@Schema({ timestamps: true })
export class Teacher {
  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  phone: string;

  @Prop()
  subject: string;

  @Prop()
  qualification: string;

  @Prop()
  experience: string;

  @Prop()
  address: string;

  @Prop()
  joinDate: string;

  @Prop({ default: 'active' })
  status: string;
}

export const TeacherSchema = SchemaFactory.createForClass(Teacher);