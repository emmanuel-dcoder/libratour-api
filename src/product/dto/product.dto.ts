import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class ProductDto {
  @ApiProperty({
    example: 'Egypt Explorer',
    description: 'Product name',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example:
      'Embark on unforgettable journeys with our carefully crafted tour packages. From cultural explorations to luxury getaways, we create memories that last a lifeti',
    description: 'about or description of product',
  })
  @IsString()
  about: string;

  @ApiProperty({
    example: 7,
    description: 'duration, this is optional',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  duration?: number;

  @ApiProperty({
    example: 34684,
    description: 'price of product',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  price: number;

  @ApiProperty({
    example: 7,
    description: 'discount price of product',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  discountPrice?: number;

  @ApiProperty({
    example: 'Cairo, Luxor, Aswan',
    description: 'This is the locations for the tour',
    required: false,
  })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({
    type: [String],
    example: ['Hot air balloon ride', 'Hagia Sophia'],
    description: 'This is the list of benefit for the product',
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
