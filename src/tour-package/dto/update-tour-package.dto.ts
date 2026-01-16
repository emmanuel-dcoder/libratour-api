import { PartialType } from '@nestjs/swagger';
import { CreateTourPackageDto } from './tour-package.dto';

export class UpdateTourPackageDto extends PartialType(CreateTourPackageDto) {}
