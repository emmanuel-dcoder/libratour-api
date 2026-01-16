import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsArray, IsMongoId, IsNumber, IsString } from 'class-validator';

export class PilgrimagePackageDto {
  @ApiProperty({
    example: 'Moulud Umrah',
    description: 'This is the name or title of the pilgrimage package',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 15850,
    description: 'duration of pilgrimage package',
  })
  @Type(() => Number)
  @IsNumber()
  duration: number;

  @ApiProperty({
    example: 15850,
    description: 'Price of pilgrimage package',
  })
  @Type(() => Number)
  @IsNumber()
  price: number;

  @ApiProperty({
    type: [String],
    example: ['Luxury accommodation', 'Guided tours', 'Transportation'],
    description: 'This is the list of benefit for the piligrimage package',
  })
  @Transform(({ value }) => {
    if (Array.isArray(value)) return value;
    return [value];
  })
  @IsArray()
  @IsString({ each: true })
  benefits: string[];

  @ApiProperty({
    example: '6960ec7f98c995ba7db5bb71',
    description: 'Mongo db id of the pilgrimage',
  })
  @IsString()
  @IsMongoId()
  pilgrimage: string;
}
