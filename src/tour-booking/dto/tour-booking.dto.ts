import {
  IsEmail,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TravelPreferenceDto {
  @ApiProperty({
    example: '2026-06-10',
    description: 'Preferred travel date',
  })
  @IsDateString()
  travelDate: Date;

  @ApiProperty({
    example: 2,
    description: 'Number of travelers',
  })
  @IsNumber()
  numberOfTravelers: number;

  @ApiProperty({
    example: 'Double',
    description: 'Room preference',
  })
  @IsString()
  roomPreference: string;

  @ApiPropertyOptional({
    example: 'Vegetarian meals',
    description: 'Any special travel requests',
  })
  @IsOptional()
  @IsString()
  specialRequests?: string;
}

export class PassportDto {
  @ApiProperty({
    example: 'A12345678',
    description: 'Passport number',
  })
  @IsString()
  number: string;

  @ApiProperty({
    example: 'Abuja',
    description: 'Place where passport was issued',
  })
  @IsString()
  placeOfIssue: string;

  @ApiProperty({
    example: '2020-01-01',
    description: 'Passport issue date',
  })
  @IsDateString()
  passportIssueDate: Date;

  @ApiProperty({
    example: '2030-01-01',
    description: 'Passport expiry date',
  })
  @IsDateString()
  passportExpiryDate: Date;
}

export class TourBookingDto {
  @ApiProperty({ example: 'Noah' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Idachaba' })
  @IsString()
  lastName: string;

  @ApiProperty({ example: 'noah@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '+2348012345678' })
  @IsString()
  phone: string;

  @ApiProperty({ example: 'Nigerian' })
  @IsString()
  nationality: string;

  @ApiPropertyOptional({
    example: '1996-04-12',
    description: 'Date of birth',
  })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: Date;

  @ApiProperty({ example: 'Abuja, Nigeria' })
  @IsString()
  address: string;

  @ApiProperty({
    example: '+2348098765432',
    description: 'Emergency contact number',
  })
  @IsString()
  emergencyContact: string;

  @ApiProperty({
    example: '64ff2c1d8cfa9b001234abcd',
    description: 'Tour package ID',
  })
  @IsMongoId()
  tourPackage: string;

  @ApiPropertyOptional({
    type: PassportDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => PassportDto)
  passport?: PassportDto;

  @ApiPropertyOptional({
    type: TravelPreferenceDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => TravelPreferenceDto)
  travelPreference?: TravelPreferenceDto;
}
