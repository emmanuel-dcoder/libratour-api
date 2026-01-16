import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsArray, IsMongoId, IsNumber, IsString } from 'class-validator';

export class HotelPackageDto {
  @ApiProperty({
    example: 'Standard Package',
    description: 'This is the name or title of the hotel package',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'Single/Double Occupancy',
    description: 'category of the hotel package',
  })
  @IsString()
  category: string;

  @ApiProperty({
    example: 15850,
    description: 'First price option for the category',
  })
  @Type(() => Number)
  @IsNumber()
  firstPrice: number;

  @ApiProperty({
    example: 61100,
    description: 'Second price option for the category',
  })
  @Type(() => Number)
  @IsNumber()
  secondPrice: number;

  @ApiProperty({
    type: [String],
    example: [
      'Iftar & Suhur included',
      'Last 10 days of Ramadan',
      'Spiritual guidance',
    ],
    description: 'This is the list of benefit for the hotel package',
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
  hotel: string;
}
