import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString } from 'class-validator';

export class AcademicInformationDto {
  @ApiProperty({ example: 'Canada' })
  @IsString()
  preferredCountry: string;

  @ApiProperty({ example: 'University of Toronto' })
  @IsString()
  firstPreferredUniversity: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  secondPreferredUniversity?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  thirdPreferredUniversity?: string;

  @ApiProperty({ example: 'Computer Science' })
  @IsString()
  firstCourseOfStudy: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  secondCourseOfStudy?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  thirdCourseOfStudy?: string;

  @ApiProperty({ example: 'Masters' })
  @IsString()
  levelOfStudy: string;

  @ApiProperty({ example: '2026-09-01' })
  @IsDateString()
  intendedStartDate: Date;

  @ApiProperty({ example: 'IELTS 7.5' })
  @IsString()
  englishTestScore: string;

  @ApiProperty({ example: 'BSc Computer Science' })
  @IsString()
  previousEducation: string;
}
