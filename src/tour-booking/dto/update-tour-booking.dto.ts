import { PartialType } from '@nestjs/swagger';
import { TourBookingDto } from './tour-booking.dto';

export class UpdateTourBookingDto extends PartialType(TourBookingDto) {}
