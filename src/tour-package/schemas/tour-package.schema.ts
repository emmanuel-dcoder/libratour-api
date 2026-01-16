import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type TourPackageDocument = TourPackage & Document;

@Schema({ timestamps: true })
export class TourPackage {
  @Prop({ required: true })
  name: string;

  @Prop({ type: Number, required: true })
  discountPrice: number;

  @Prop({ type: Number, required: true })
  price: number;

  @Prop({ type: [String] })
  benefits: string[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Tour', required: true })
  tour: mongoose.Types.ObjectId;
}

export const TourPackageSchema = SchemaFactory.createForClass(TourPackage);
