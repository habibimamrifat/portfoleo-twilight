import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

import { Transform } from 'class-transformer';

import { ProjectPlatform, ProjectStatus } from '@prisma/client';

export class CreateProjectDto {
  @IsString()
  name!: string;

  @IsString()
  description!: string;

  @IsOptional()
  @IsString()
  liveLink?: string;

  @IsOptional()
  @IsString()
  githubLink?: string;

  @IsEnum(ProjectStatus)
  status!: ProjectStatus;

  @IsEnum(ProjectPlatform)
  platform!: ProjectPlatform;

  @IsOptional()
  @IsString()
  approachTaken?: string;

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
  featured?: boolean;

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

export class UpdateProjectDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  liveLink?: string;

  @IsOptional()
  @IsString()
  githubLink?: string;

  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;

  @IsOptional()
  @IsEnum(ProjectPlatform)
  platform?: ProjectPlatform;

  @IsOptional()
  @IsString()
  approachTaken?: string;

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
  featured?: boolean;

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
