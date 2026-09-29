import { ArrayMinSize, IsArray, IsOptional, IsString } from 'class-validator';

export class CreateBannerQuoteDto {
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  primaryText!: string[];

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  secondaryText!: string[];
}

export class UpdateBannerQuoteDto {
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  primaryText?: string[];

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  secondaryText?: string[];
}
