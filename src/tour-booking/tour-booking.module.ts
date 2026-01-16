import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TourBooking, TourBookingSchema } from './schemas/tour-booking.schema';
import { TourBookingController } from './tour-booking.controller';
import { TourBookingService } from './tour-booking.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TourBooking.name, schema: TourBookingSchema },
    ]),
  ],
  controllers: [TourBookingController],
  providers: [TourBookingService],
})
export class TourBookingModule {}
