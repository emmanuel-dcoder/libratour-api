import { PartialType } from '@nestjs/swagger';
import { PilgrimageDto } from './pilgrimage.dto';

export class UpdatePilgrimageDto extends PartialType(PilgrimageDto) {}
