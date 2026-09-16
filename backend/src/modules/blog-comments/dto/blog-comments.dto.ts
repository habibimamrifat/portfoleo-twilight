import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { CommentStatus } from '@prisma/client';

export class CreateBlogCommentDto {
  @IsString()
  blogPostId!: string;

  @IsString()
  name!: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsString()
  comment!: string;
}

export class UpdateBlogCommentDto {
  @IsOptional()
  @IsEnum(CommentStatus)
  status?: CommentStatus;
}
