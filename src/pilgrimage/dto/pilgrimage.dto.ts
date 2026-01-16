import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsArray, IsNumber, IsString } from 'class-validator';

export class PilgrimageDto {
  @ApiProperty({
    example: 'Moulud Umrah',
    description: 'Name of Hajj Pilgrimage',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'Special Umrah package during the blessed month of Moulud...',
    description: 'Hajj / Pilgrimage description',
  })
  @IsString()
  about: string;

  @ApiProperty({
    type: [String],
    example: ['Luxury accommodation', 'Guided tours', 'Transportation'],
    description: 'Benefit of pilgrimage in arrays',
  })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  @IsArray()
  @IsString({ each: true })
  benefits: string[];

  @ApiProperty({
    example: 10,
    description: 'Duration or number of days',
  })
  @Type(() => Number)
  @IsNumber()
  duration: number;
}
