import { PartialType } from '@nestjs/swagger';
import { ProductPackageDto } from './product-package.dto';

export class UpdateProductPackageDto extends PartialType(ProductPackageDto) {}
