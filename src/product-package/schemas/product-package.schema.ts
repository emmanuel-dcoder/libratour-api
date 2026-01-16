import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type ProductPackageDocument = ProductPackage & Document;

@Schema({ timestamps: true })
export class ProductPackage {
  @Prop({ required: true })
  name: string;

  @Prop({ type: Number, required: true })
  price: number;

  @Prop({ type: [String], required: true })
  benefits: string[];

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  })
  product: mongoose.Types.ObjectId;
}

export const ProductPackageSchema =
  SchemaFactory.createForClass(ProductPackage);
