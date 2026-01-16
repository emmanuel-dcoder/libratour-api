import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateTourDto {
  @ApiProperty({
    example: 'Egypt Explorer',
    description: 'This is the name or title of the tour location',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'Cairo, Luxor, Aswan',
    description: 'This is the locations for the tour',
    required: false,
  })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({
    example: 1200,
    description: 'This is the price for the tour',
  })
  @Type(() => Number)
  @IsNumber()
  price: number;

  @ApiProperty({
    example: 1000,
    description: 'This is the service price for the tour',
  })
  @Type(() => Number)
  @IsNumber()
  discountPrice: number;

  @ApiProperty({
    type: [String],
    example: ['Hot air balloon ride', 'Hagia Sophia'],
    description: 'This is the list of benefit for the tour',
  })
  @IsString()
  benefits: string[];

  @ApiProperty({
    example: 4.7,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 1 })
  @Min(0)
  @Max(5)
  rating?: number;
}
