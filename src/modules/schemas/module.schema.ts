import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SchoolModuleDocument = HydratedDocument<Module>;

@Schema({ timestamps: true })
export class Module {
  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  teacherId!: string;

  @Prop({ required: true })
  teacherName!: string;

  @Prop({ required: true })
  description!: string;

  @Prop({ required: true })
  duration!: string;

  @Prop({ required: true, min: 0 })
  fee!: number;

  @Prop({ required: true })
  batch!: string;

  @Prop({ required: true, enum: ['active', 'inactive'], default: 'active' })
  status!: 'active' | 'inactive';

  @Prop({ type: String, default: '' })
  term?: string;

  @Prop({ type: Number, default: 0 })
  unit?: number;

  @Prop({ type: String, enum: ['main', 'basket', 'none'], default: 'none' })
  subjectCategory?: 'main' | 'basket' | 'none';

  @Prop([
    {
      title: String,
      fileType: String,
      fileUrl: String,
      fileKey: String,
      url: String,
      thumbnailUrl: String,
      description: String,
      batch: String,
      uploadedAt: Date,
      isPublished: { type: Boolean, default: false },
    },
  ])
  resources?: {
    title: string;
    fileType: string;
    fileUrl: string;
    fileKey: string;
    url?: string;
    thumbnailUrl?: string;
    description?: string;
    batch?: string;
    uploadedAt?: Date;
    isPublished?: boolean;
  }[];
}

export const ModuleSchema = SchemaFactory.createForClass(Module);
