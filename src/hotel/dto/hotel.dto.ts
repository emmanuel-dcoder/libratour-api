import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class HotelDto {
  @ApiProperty({
    example: 'Fairmont Makkah Clock Hotel',
    description: 'Hotel name',
  })
  @IsString()
  name: string;

  @ApiPropertyOptional({
    example: 'Makkah, Saudi Arabia',
    description: 'Hotel location',
  })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({
    example: 'Experience luxury and comfort at Fairmont Makkah Clock Hotel...',
    description: 'Hotel description',
  })
  @IsString()
  about: string;

  @ApiProperty({
    example: '$7,925/person',
    description: 'Price for single or double person',
  })
  @IsString()
  singleDoublePricing: string;

  @ApiProperty({
    example: '$6,100/person',
    description: 'Price for tripple person',
  })
  @IsString()
  tripplePricing: string;

  @ApiProperty({
    example: '$5,170/person',
    description: 'Price for quad person',
  })
  @IsString()
  quadPricing: string;

  @ApiPropertyOptional({
    example: 4.7,
    description: 'Rating between 0 and 5',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 1 })
  @Min(0)
  @Max(5)
  rating?: number;

  @ApiProperty({
    type: [String],
    example: ['Free WiFi', 'Parking', 'Coffee Shop'],
    description: 'Hotel amenities',
  })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  @IsArray()
  @IsString({ each: true })
  amenities: string[];
}
