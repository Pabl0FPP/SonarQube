import { IsOptional, IsString, IsUUID } from "class-validator";

export class CreateCandleDto {
  @IsString()
  message: string;

  @IsString()
  @IsOptional()
  qr?: string;

  @IsString()
  @IsOptional()
  image?: string;

  @IsUUID()
  fraganceId: string;

  @IsUUID()
  containerId: string;
  
  }