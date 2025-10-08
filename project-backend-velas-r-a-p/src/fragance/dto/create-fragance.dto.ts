import { IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateFraganceDto {

    @ApiProperty({ example: 'Vanilla Dream', description: 'Name of the fragance' })
    @IsString()
    name: string;

    @ApiProperty({ example: 'Vanilla, Citrus', description: 'Top notes of the fragance' })
    @IsString()
    topNotes: string;

    @ApiProperty({ example: 'Jasmine, Rose', description: 'Middle notes of the fragance' })
    @IsString()
    middleNotes: string;

    @ApiProperty({ example: 'Sandalwood, Musk', description: 'Base notes of the fragance' })
    @IsString()
    baseNotes: string;

    @ApiProperty({ example: 'https://example.com/image.jpg', description: 'Image URL of the fragance' })
    @IsString()
    image: string;
}
