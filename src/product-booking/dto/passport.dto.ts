import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsString } from 'class-validator';

export class PassportDto {
  @ApiProperty({ example: 'A12345678' })
  @IsString()
  number: string;

  @ApiProperty({ example: 'Abuja' })
  @IsString()
  placeOfIssue: string;

  @ApiProperty({ example: '2020-01-01' })
  @IsDateString()
  passportIssueDate: Date;

  @ApiProperty({ example: '2030-01-01' })
  @IsDateString()
  passportExpiryDate: Date;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  contactName: string;

  @ApiProperty({ example: '+2348012345678' })
  @IsString()
  contactPhone: string;

  @ApiProperty({ example: 'Brother' })
  @IsString()
  relationship: string;
}
