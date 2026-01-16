import { PartialType } from '@nestjs/swagger';
import { ProductBookingDto } from './product-booking.dto';

export class UpdateProductBookingDto extends PartialType(ProductBookingDto) {}
