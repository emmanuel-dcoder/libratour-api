import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PilgrimageDocument = Pilgrimage & Document;

@Schema({ timestamps: true })
export class Pilgrimage {
  @Prop({ required: true })
  name: string;

  @Prop()
  location: string;

  @Prop()
  about: string;

  @Prop({ type: [String] })
  benefits: string[];

  @Prop({ type: Number, required: true })
  duration: number;
}

export const PilgrimageSchema = SchemaFactory.createForClass(Pilgrimage);
