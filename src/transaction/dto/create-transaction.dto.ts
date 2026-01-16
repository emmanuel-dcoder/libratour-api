import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsMongoId } from 'class-validator';

export class CreateTransactionDto {
  @ApiProperty({
    example: '69638244dcc90f1d6431e100',
    description: 'ID of the product package',
  })
  @IsMongoId()
  @IsString()
  productPackageId: string;

  @ApiProperty({
    description: 'reference of the payment',
  })
  @IsOptional()
  @IsString()
  reference?: string;

  @ApiProperty({
    description: 'payment gateway method used',
    example: 'lotus',
    default: 'lotus',
  })
  @IsString()
  paymentMethod: string;

  @ApiProperty({
    description: 'quentiy of the transaction',
    example: 1,
    default: 1,
  })
  @IsOptional()
  @IsNumber()
  quantity: number;
}
