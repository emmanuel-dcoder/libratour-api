import { PartialType } from '@nestjs/swagger';
import { HotelDto } from './hotel.dto';

export class UpdateHotelDto extends PartialType(HotelDto) {}
