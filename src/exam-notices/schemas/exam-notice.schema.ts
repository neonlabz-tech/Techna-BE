import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ExamNoticeDocument = HydratedDocument<ExamNotice>;

@Schema({ timestamps: true })
export class ExamNotice {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true, trim: true })
  moduleId: string;

  @Prop({ required: true, trim: true })
  moduleName: string;

  @Prop({ required: true, trim: true })
  batch: string;

  @Prop({ required: true, trim: true })
  date: string;

  @Prop({ required: true, trim: true })
  startTime: string;

  @Prop({ required: true, trim: true })
  endTime: string;

  @Prop({ required: true, trim: true })
  venue: string;

  @Prop({ trim: true })
  description?: string;

  @Prop({ default: false })
  isPublished: boolean;

  @Prop()
  publishedAt?: Date;
}

export const ExamNoticeSchema = SchemaFactory.createForClass(ExamNotice);