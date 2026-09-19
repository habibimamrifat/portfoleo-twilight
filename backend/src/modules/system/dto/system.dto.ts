import { IsBoolean, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateSystemDto {
  @IsOptional()
  @IsString()
  backgroundColor?: string;

  @IsOptional()
  @IsString()
  moonlightColor?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  particleCount?: number;

  @IsOptional()
  @IsString()
  particleColor?: string;

  @IsOptional()
  @IsBoolean()
  particleLinksEnabled?: boolean;

  @IsOptional()
  @IsString()
  particleLinkColor?: string;

  @IsOptional()
  @IsString()
  cardColor?: string;

  @IsOptional()
  @IsString()
  buttonColor?: string;
}

export class UpdateSystemDto {
  @IsOptional()
  @IsString()
  backgroundColor?: string;

  @IsOptional()
  @IsString()
  moonlightColor?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  particleCount?: number;

  @IsOptional()
  @IsString()
  particleColor?: string;

  @IsOptional()
  @IsBoolean()
  particleLinksEnabled?: boolean;

  @IsOptional()
  @IsString()
  particleLinkColor?: string;

  @IsOptional()
  @IsString()
  cardColor?: string;

  @IsOptional()
  @IsString()
  buttonColor?: string;
}
