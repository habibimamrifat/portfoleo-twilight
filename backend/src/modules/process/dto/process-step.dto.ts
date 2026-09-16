import { IsBoolean, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateProcessStepDto {
  @IsString()
  name!: string;

  @IsString()
  detail!: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateProcessStepDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  detail?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
