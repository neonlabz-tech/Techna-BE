import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAnnouncementDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  date!: string;

  @IsString()
  @IsIn(['All Students'])
  audience: 'All Students' = 'All Students';

  @IsOptional()
  @IsString()
  batch?: string;

  @IsString()
  @IsNotEmpty()
  content!: string;

  @IsOptional()
  @IsString()
  author?: string;
}
