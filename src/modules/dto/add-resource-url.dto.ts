import { IsString, IsNotEmpty, IsUrl, IsOptional, IsBoolean } from 'class-validator';

export class AddResourceUrlDto {
  @IsString()
  @IsNotEmpty()
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

  @IsBoolean()
  @IsOptional()
  isPublished?: boolean = false;
}
