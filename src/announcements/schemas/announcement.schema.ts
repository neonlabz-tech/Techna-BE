import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AnnouncementDocument = HydratedDocument<Announcement>;

@Schema({ timestamps: true })
export class Announcement {
  @Prop({ required: true, trim: true })
  title!: string;

  @Prop({ required: true })
  date!: string;

  @Prop({ required: true, default: 'All Students' })
  audience!: 'All Students';

  @Prop({ default: 'None' })
  batch?: string;

  @Prop({ required: true })
  content!: string;

  @Prop({ default: 'Super Admin' })
  author!: string;
}

export const AnnouncementSchema = SchemaFactory.createForClass(Announcement);
