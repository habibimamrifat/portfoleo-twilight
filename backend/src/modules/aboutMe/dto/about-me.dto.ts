import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

import { Transform } from 'class-transformer';

export class CreateAboutMeDto {
  @IsString()
  detailAboutMe!: string;
}

export class UpdateAboutMeDto {
  @IsOptional()
  @IsString()
  detailAboutMe?: string;
}

export class CreateWorkSectorDto {
  @IsString()
  sectorName!: string;

  @IsString()
  sectorDetail!: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Transform(({ value }) => {
    if (value === '' || value === undefined) return value;
    return Number(value);
  })
  sortOrder?: number;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  isActive?: boolean;
}

export class UpdateWorkSectorDto {
  @IsOptional()
  @IsString()
  sectorName?: string;

  @IsOptional()
  @IsString()
  sectorDetail?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Transform(({ value }) => {
    if (value === '' || value === undefined) return value;
    return Number(value);
  })
  sortOrder?: number;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  isActive?: boolean;
}
