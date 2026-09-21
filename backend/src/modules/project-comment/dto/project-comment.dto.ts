import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateProjectCommentDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name!: string;

  @IsEmail()
  @IsOptional()
  @MaxLength(255)
  email?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  comment!: string;

  @IsString()
  @IsNotEmpty()
  projectId!: string;
}

export class UpdateProjectCommentDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(['PENDING', 'APPROVED', 'REJECTED'])
  status!: 'PENDING' | 'APPROVED' | 'REJECTED';
}
