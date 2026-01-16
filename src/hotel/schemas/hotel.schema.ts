import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type HotelDocument = Hotel & Document;

@Schema({ timestamps: true })
export class Hotel {
  @Prop({ required: true })
  name: string;

  @Prop()
  location: string;

  @Prop()
  about: string;

  @Prop({ type: [String] })
  amenities: string[];

  @Prop({ type: String, required: true })
  singleDoublePricing: string;

  @Prop({ type: String, required: true })
  tripplePricing: string;

  @Prop({ type: String, required: true })
  quadPricing: string;

  @Prop({ required: true })
  image: string;

  @Prop({
    type: Number,
    min: 0,
    max: 5,
    default: 0,
  })
  rating: number;
}

export const HotelSchema = SchemaFactory.createForClass(Hotel);
