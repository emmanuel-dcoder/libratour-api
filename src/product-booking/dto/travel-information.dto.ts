import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsString } from 'class-validator';

export class TravelInformationDto {
  @ApiProperty({ example: 'Tourism' })
  @IsString()
  purpose: string;

  @ApiProperty({ example: '14 days' })
  @IsString()
  duration: string;

  @ApiProperty({ example: '2026-06-10' })
  @IsDateString()
  arrivalDate: Date;

  @ApiProperty({ example: '2026-06-24' })
  @IsDateString()
  departureDate: Date;

  @ApiProperty({ example: 'Hotel ABC, Dubai' })
  @IsString()
  accomodationAddress: string;
}
