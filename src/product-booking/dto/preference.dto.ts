import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

export class PreferenceDto {
  @ApiProperty({ example: '2026-06-10' })
  @IsDateString()
  travelDate: Date;

  @ApiProperty({ example: 2 })
  @IsNumber()
  numberOfTravelers: number;

  @ApiProperty({ example: 'Double' })
  @IsString()
  roomPreference: string;

  @ApiPropertyOptional({ example: 'Vegetarian meals' })
  @IsOptional()
  @IsString()
  specialRequests?: string;
}
