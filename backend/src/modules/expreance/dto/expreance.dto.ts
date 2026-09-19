import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

import { Transform } from 'class-transformer';

import { EmploymentType } from '@prisma/client';

export class CreateExperienceDto {
  @IsString()
  organization!: string;

  @IsString()
  role!: string;

  @IsString()
  responsibilities!: string;

  @IsOptional()
  @IsString()
  learned?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsEnum(EmploymentType)
  employmentType!: EmploymentType;

  @IsDateString()
  startDate!: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

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
  isCurrent?: boolean;

  @IsOptional()
  @IsString()
  experienceLetterUrl?: string;

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

export class UpdateExperienceDto {
  @IsOptional()
  @IsString()
  organization?: string;

  @IsOptional()
  @IsString()
  role?: string;

  @IsOptional()
  @IsString()
  responsibilities?: string;

  @IsOptional()
  @IsString()
  learned?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsEnum(EmploymentType)
  employmentType?: EmploymentType;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

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
  isCurrent?: boolean;

  @IsOptional()
  @IsString()
  experienceLetterUrl?: string;

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
