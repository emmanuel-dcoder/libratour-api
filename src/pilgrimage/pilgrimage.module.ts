import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CloudinaryService } from 'src/core/cloudinary/cloudinary.service';
import { Pilgrimage, PilgrimageSchema } from './schemas/pilgrimage.schema';
import { PilgrimageController } from './pilgrimage.controller';
import { PilgrimageService } from './pilgrimage.service';
import { PilgrimagePackageService } from 'src/pilgrimage-package/pilgrimage-package.service';
import {
  PilgrimagePackage,
  PilgrimagePackageSchema,
} from 'src/pilgrimage-package/schemas/pilgrimage-package.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Pilgrimage.name, schema: PilgrimageSchema },
      { name: PilgrimagePackage.name, schema: PilgrimagePackageSchema },
    ]),
  ],
  controllers: [PilgrimageController],
  providers: [CloudinaryService, PilgrimageService, PilgrimagePackageService],
})
export class PilgrimageModule {}
