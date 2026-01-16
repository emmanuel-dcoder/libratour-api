import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type PilgrimagePackageDocument = PilgrimagePackage & Document;

@Schema({ timestamps: true })
export class PilgrimagePackage {
  @Prop({ required: true })
  name: string;

  @Prop({ type: Number, required: true })
  price: number;

  @Prop({ type: Number, required: true })
  duration: number;

  @Prop({ type: [String] })
  benefits: string[];

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pilgrimage',
    required: true,
  })
  pilgrimage: mongoose.Types.ObjectId;
}

export const PilgrimagePackageSchema =
  SchemaFactory.createForClass(PilgrimagePackage);
