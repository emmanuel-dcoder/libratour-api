import { PartialType } from '@nestjs/swagger';
import { CreateTourDto } from './tour.dto';

export class UpdateTourDto extends PartialType(CreateTourDto) {}
