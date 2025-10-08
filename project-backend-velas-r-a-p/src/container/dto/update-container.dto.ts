import { PartialType } from '@nestjs/mapped-types';
import { CreateContainerDto } from './create-container.dto';
import { IsNumber, IsString } from 'class-validator';

export class UpdateContainerDto extends PartialType(CreateContainerDto) {

    @IsString()
    name: string;

    @IsString()
    material: string;

    @IsNumber()
    diameter: number;

    @IsNumber()
    height: number;
}
