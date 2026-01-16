import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ProductBooking,
  ProductBookingSchema,
} from './schemas/product-booking.schema';
import { ProductBookingController } from './product-booking.controller';
import { ProductBookingService } from './product-booking.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ProductBooking.name, schema: ProductBookingSchema },
    ]),
  ],
  controllers: [ProductBookingController],
  providers: [ProductBookingService],
})
export class ProductBookingModule {}
