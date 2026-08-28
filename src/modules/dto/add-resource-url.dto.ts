import { IsString, IsNotEmpty, IsUrl, IsOptional, IsBoolean, MinLength } from 'class-validator';

export class AddResourceUrlDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3, { message: 'Title must be at least 3 characters' })
  title!: string;

  @IsString()
  @IsNotEmpty()
  @IsUrl()
  url!: string;

  @IsString()
  @IsOptional()
  thumbnailUrl?: string;

  @IsString()
  fileType: string = 'video';

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  batch!: string;

  @IsBoolean()
  @IsOptional()
  isPublished?: boolean = false;
}
