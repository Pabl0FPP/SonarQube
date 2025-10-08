import { IsString, IsOptional } from 'class-validator';

export class RecommendationDto {
  @IsString()
  intention: string;

  @IsOptional()
  @IsString()
  space?: string;

  @IsOptional()
  @IsString()
  ambiance?: string;

  @IsOptional()
  @IsString()
  emotion?: string;

  @IsOptional()
  @IsString()
  occasion?: string;

  [key: string]: string | undefined;
}