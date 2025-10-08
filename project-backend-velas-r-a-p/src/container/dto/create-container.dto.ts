import { IsNumber, IsString, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateContainerDto {

    @ApiProperty({ example: 'Glass Jar', description: 'Name of the container' })
    @IsString()
    name: string;

    @ApiProperty({ example: 'Glass', description: 'Material of the container' })
    @IsString()
    material: string;

    @ApiProperty({ example: 8, description: 'Diameter of the container in centimeters' })
    @IsNumber()
    diameter: number;

    @ApiProperty({ example: 10, description: 'Height of the container in centimeters' })
    @IsNumber()
    height: number;

    @ApiProperty({ example: 'https://example.com/image.jpg', description: 'Image URL of the container' })
    @IsString()
    @IsOptional()
    image?: string;
}
