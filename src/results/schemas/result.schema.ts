import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ResultDocument = HydratedDocument<Result>;

@Schema({ _id: false })
export class ModuleResult {
  @Prop({ required: true, trim: true })
  moduleName!: string;

  @Prop({ required: true, enum: ['Mid exam', 'Final exam'] })
  examType!: 'Mid exam' | 'Final exam';

  @Prop({ required: true, min: 0, max: 100 })
  marks!: number;

  @Prop({ required: true, enum: ['A', 'B', 'C', 'F'] })
  grade!: 'A' | 'B' | 'C' | 'F';
}

export const ModuleResultSchema = SchemaFactory.createForClass(ModuleResult);

@Schema({ timestamps: true })
export class Result {
  @Prop({ required: true, trim: true })
  studentId!: string;

  @Prop({ required: true, trim: true })
  studentName!: string;

  @Prop({ required: true, trim: true })
  batch!: string;

  @Prop({ type: [ModuleResultSchema], default: [] })
  modules!: ModuleResult[];
}

export const ResultSchema = SchemaFactory.createForClass(Result);