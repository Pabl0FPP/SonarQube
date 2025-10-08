import { PartialType } from '@nestjs/mapped-types';
import { CreateFraganceDto } from './create-fragance.dto';
import { IsString } from 'class-validator';

export class UpdateFraganceDto extends PartialType(CreateFraganceDto) {

    @IsString()
    name: string;

    @IsString()
    topNotes: string;

    @IsString()
    middleNotes: string;

    @IsString()
    baseNotes: string;

    @IsString()
    image: string;
}
