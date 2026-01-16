import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MailService } from 'src/core/mail/email';
import { CloudinaryService } from 'src/core/cloudinary/cloudinary.service';
import { NotificationService } from 'src/notification/services/notification.service';
import {
  Notification,
  NotificationSchema,
} from 'src/notification/schemas/notification.schema';
import { Tour, TourSchema } from './schemas/tour.schema';
import { TourController } from './tour.controller';
import { TourService } from './tour.service';
import { TourPackageService } from 'src/tour-package/tour-package.service';
import {
  TourPackage,
  TourPackageSchema,
} from 'src/tour-package/schemas/tour-package.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Tour.name, schema: TourSchema },
      { name: TourPackage.name, schema: TourPackageSchema },
      { name: Notification.name, schema: NotificationSchema },
    ]),
  ],
  controllers: [TourController],
  providers: [
    TourService,
    MailService,
    CloudinaryService,
    NotificationService,
    TourPackageService,
  ],
})
export class TourModule {}
