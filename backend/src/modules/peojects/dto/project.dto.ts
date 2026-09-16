import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

import { ProjectPlatform, ProjectStatus } from '@prisma/client';

export class CreateProjectDto {
  @IsString()
  name!: string;

  @IsString()
  description!: string;

  @IsArray()
  @IsString({ each: true })
  images!: string[];

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
  @IsBoolean()
  featured?: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;

  @IsOptional()
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
  @IsArray()
  @IsString({ each: true })
  images?: string[];

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
  @IsBoolean()
  featured?: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
