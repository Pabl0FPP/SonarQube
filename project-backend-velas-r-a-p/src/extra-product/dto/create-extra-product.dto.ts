import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateExtraProductDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  image: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  price: number;
} 