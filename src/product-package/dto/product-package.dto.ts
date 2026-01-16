import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsArray, IsMongoId, IsNumber, IsString } from 'class-validator';

export class ProductPackageDto {
  @ApiProperty({
    example: 'Standard Package',
    description: 'This is the name or title of the product package',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: '1200',
    description: 'This is the price for the product package',
  })
  @Type(() => Number)
  @IsNumber()
  price: number;

  @ApiProperty({
    type: [String],
    example: ['Hot air balloon ride', 'Hagia Sophia'],
    description: 'This is the list of benefit for the product package',
  })
  @Transform(({ value }) => {
    if (Array.isArray(value)) return value;
    return [value];
  })
  @IsArray()
  @IsString({ each: true })
  benefits: string[];

  @ApiProperty({
    example: '696165cad34527da8ddbca8a',
    description: 'Mongo db id of the product',
  })
  @IsString()
  @IsMongoId()
  product: string;
}
