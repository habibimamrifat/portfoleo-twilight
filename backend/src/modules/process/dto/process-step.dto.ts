import { Transform } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateProcessStepDto {
  @IsString()
  name!: string;

  @IsString()
  detail!: string;

  @IsOptional()
  @IsString()
  img?: string;

  @IsOptional()
  @Transform(({ value }) => {
    if (value === '' || value === undefined) return value;
    return Number(value);
  })
  @IsInt()
  @Min(0)
  sortOrder?: number;

  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
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
  @IsString()
  img?: string;

  @IsOptional()
  @Transform(({ value }) => {
    if (value === '' || value === undefined) return value;
    return Number(value);
  })
  @IsInt()
  @Min(0)
  sortOrder?: number;

  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean()
  isActive?: boolean;
}
