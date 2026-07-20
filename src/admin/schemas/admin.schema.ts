import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AdminDocument = HydratedDocument<Admin>;

@Schema({ timestamps: true, collection: 'admin' })
export class Admin {
  @Prop({ required: true, unique: true })
  email!: string;

  @Prop({ required: true })
  password!: string;

  @Prop({ default: 'admin' })
  role!: string;

  @Prop({ default: true })
  isActive!: boolean;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
