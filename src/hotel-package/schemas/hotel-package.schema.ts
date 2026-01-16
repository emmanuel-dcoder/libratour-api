import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type HotelPackageDocument = HotelPackage & Document;

@Schema({ timestamps: true })
export class HotelPackage {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  category: string;

  @Prop({ type: Number, required: true })
  firstPrice: number;

  @Prop({ type: Number, required: true })
  secondPrice: number;

  @Prop({ type: [String] })
  benefits: string[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true })
  hotel: mongoose.Types.ObjectId;
}

export const HotelPackageSchema = SchemaFactory.createForClass(HotelPackage);
