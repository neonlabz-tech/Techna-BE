import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TeacherDocument = HydratedDocument<Teacher>;

@Schema({ timestamps: true })
export class Teacher {
  @Prop({ required: true })
  fullName!: string;

  @Prop({ type: String, default: '' })
  firstName?: string;

  @Prop({ type: String, default: '' })
  lastName?: string;

  @Prop({ required: true, lowercase: true, trim: true })
  email!: string;

  @Prop({ required: true })
  password!: string;

  @Prop({ required: true })
  phone!: string;

  @Prop({ type: [String], default: [] })
  subject!: string[];

  @Prop({ type: String, default: '' })
  qualification?: string;

  @Prop({ required: true })
  experience!: string;

  @Prop({ required: true })
  address!: string;

  @Prop({ required: true })
  joinDate!: string;

  @Prop({ required: true, enum: ['active', 'inactive'], default: 'active' })
  status!: 'active' | 'inactive';

  @Prop({ type: String, default: '' })
  photoUrl?: string;

  @Prop({ type: String, default: '' })
  photoKey?: string;

  @Prop({ type: [String], default: [] })
  degree?: string[];

  @Prop({ type: [String], default: [] })
  specializations?: string[];

  @Prop({ type: [String], default: [] })
  awards?: string[];

  @Prop({ type: [String], default: [] })
  achievements?: string[];

  @Prop({ type: String, default: '' })
  biography?: string;
}

export const TeacherSchema = SchemaFactory.createForClass(Teacher);
