import { PartialType } from '@nestjs/swagger';
import { PilgrimagePackageDto } from './pilgrimage-package.dto';

export class UpdatePilgrimagePackageDto extends PartialType(
  PilgrimagePackageDto,
) {}
