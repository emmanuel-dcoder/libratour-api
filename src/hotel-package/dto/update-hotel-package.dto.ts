import { PartialType } from '@nestjs/swagger';
import { HotelPackageDto } from './hotel-package.dto';

export class UpdateHotelPackageDto extends PartialType(HotelPackageDto) {}
