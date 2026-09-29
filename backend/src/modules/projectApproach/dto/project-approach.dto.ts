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

export class CreateProjectApproachDto {
  @IsString()
  approachTitle!: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  detail!: string[];

  @IsOptional()
  @IsString()
  approachImg?: string;

  @IsOptional()
  @Transform(({ value }) => {
    if (value === '' || value === undefined) {
      return value;
    }

    return Number(value);
  })
  @IsInt()
  @Min(0)
  sortOrder?: number;

  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') {
      return true;
    }

    if (value === 'false') {
      return false;
    }

    return value;
  })
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateProjectApproachDto {
  @IsOptional()
  @IsString()
  approachTitle?: string;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  detail?: string[];

  @IsOptional()
  @IsString()
  approachImg?: string;

  @IsOptional()
  @Transform(({ value }) => {
    if (value === '' || value === undefined) {
      return value;
    }

    return Number(value);
  })
  @IsInt()
  @Min(0)
  sortOrder?: number;

  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') {
      return true;
    }

    if (value === 'false') {
      return false;
    }

    return value;
  })
  @IsBoolean()
  isActive?: boolean;
}
