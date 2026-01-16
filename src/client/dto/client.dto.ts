import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsUrl } from 'class-validator';

export class ClientDto {
  @ApiProperty({ example: 'Test Bank' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'joseph@gmail.com' })
  @IsString()
  @IsEmail()
  email: string;
}

export class AuthClientDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6' })
  @IsString()
  headers: string;

  @ApiProperty({ example: 'joseph@gmail.com' })
  @IsString()
  @IsEmail()
  email: string;
}
