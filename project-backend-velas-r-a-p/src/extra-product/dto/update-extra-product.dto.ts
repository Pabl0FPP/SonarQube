import { PartialType } from '@nestjs/mapped-types';
import { CreateExtraProductDto } from './create-extra-product.dto';

export class UpdateExtraProductDto extends PartialType(CreateExtraProductDto) {} 