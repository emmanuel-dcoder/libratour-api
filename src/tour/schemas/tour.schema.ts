import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type TourDocument = Tour & Document;

@Schema({ timestamps: true })
export class Tour {
  @Prop({ required: true })
  name: string;

  @Prop()
  location: string;

  @Prop({ type: Number, required: true })
  discountPrice: number;

  @Prop({ type: Number, required: true })
  price: number;

  @Prop({ required: true })
  image: string;

  @Prop({ type: [String] })
  benefits: string[];
  @Prop({
    type: Number,
    min: 0,
    max: 5,
    default: 0,
  })
  rating: number;
}

export const TourSchema = SchemaFactory.createForClass(Tour);
