import {
  IsEmail,
  IsMongoId,
  IsOptional,
  IsString,
  ValidateNested,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PassportDto } from './passport.dto';
import { TravelInformationDto } from './travel-information.dto';
import { PreferenceDto } from './preference.dto';
import { AcademicInformationDto } from './academic-information.dto copy';

export class ProductBookingDto {
  @ApiProperty({ example: 'Noah Joseph' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'noah@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '+2348012345678' })
  @IsString()
  phone: string;

  @ApiProperty({ example: 'Nigerian' })
  @IsString()
  nationality: string;

  @ApiPropertyOptional({ example: '1996-04-12' })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: Date;

  @ApiPropertyOptional({ example: 'Abuja, Nigeria' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  gender?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  maritalStatus?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  occupation?: string;

  @ApiProperty({ example: '+2348098765432' })
  @IsString()
  emergencyContact: string;

  @ApiProperty({ example: '69638244dcc90f1d6431e100' })
  @IsMongoId()
  productPackage: string;

  @ApiPropertyOptional({ type: PassportDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => PassportDto)
  passport?: PassportDto;

  @ApiPropertyOptional({ type: TravelInformationDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => TravelInformationDto)
  travelInformation?: TravelInformationDto;

  @ApiPropertyOptional({ type: PreferenceDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => PreferenceDto)
  travelPreference?: PreferenceDto;

  @ApiPropertyOptional({ type: AcademicInformationDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => AcademicInformationDto)
  academicInformation?: AcademicInformationDto;
}
