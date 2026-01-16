import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CloudinaryService } from 'src/core/cloudinary/cloudinary.service';
import { Hotel, HotelSchema } from './schemas/hotel.schema';
import { HotelController } from './hotel.controller';
import { HotelService } from './hotel.service';
import { HotelPackageService } from 'src/hotel-package/hotel-package.service';
import {
  HotelPackage,
  HotelPackageSchema,
} from 'src/hotel-package/schemas/hotel-package.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Hotel.name, schema: HotelSchema },
      { name: HotelPackage.name, schema: HotelPackageSchema },
    ]),
  ],
  controllers: [HotelController],
  providers: [CloudinaryService, HotelService, HotelPackageService],
})
export class HotelModule {}
