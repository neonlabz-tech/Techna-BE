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

  @Prop([
    {
      title: String,
      fileType: String, // video | image | pdf
      fileUrl: String,
      fileKey: String,
    },
  ])
  resources?: {
    title: string;
    fileType: string;
    fileUrl: string;
    fileKey: string;
  }[];
}

export const ModuleSchema = SchemaFactory.createForClass(Module);
