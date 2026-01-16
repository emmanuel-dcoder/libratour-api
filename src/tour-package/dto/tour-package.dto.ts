import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsArray, IsMongoId, IsNumber, IsString } from 'class-validator';

export class CreateTourPackageDto {
  @ApiProperty({
    example: 'Standard Package',
    description: 'This is the name or title of the tour package',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: '1200',
    description: 'This is the price for the tour package',
  })
  @Type(() => Number)
  @IsNumber()
  price: number;

  @ApiProperty({
    example: '1200',
    description: 'This is the discount price for the tour package',
  })
  @Type(() => Number)
  @IsNumber()
  discountPrice: number;

  @ApiProperty({
    type: [String],
    example: ['Hot air balloon ride', 'Hagia Sophia'],
    description: 'This is the list of benefit for the tour package',
  })
  @Transform(({ value }) => {
    if (Array.isArray(value)) return value;
    return [value];
  })
  @IsArray()
  @IsString({ each: true })
  benefits: string[];

  @ApiProperty({
    example: '68e0becbaddb938aacc42acc',
    description: 'Mongo db id of the tour',
  })
  @IsString()
  @IsMongoId()
  tour: string;
}
