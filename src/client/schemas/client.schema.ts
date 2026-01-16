import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ClientDocument = Client & Document;

@Schema({ timestamps: true })
export class Client {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, unique: true, select: false })
  apiKeyHash: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: [String] })
  allowedIps?: string[];

  @Prop({ select: false })
  refreshTokenHash?: string;
}

export const ClientSchema = SchemaFactory.createForClass(Client);
