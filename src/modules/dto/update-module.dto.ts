import {
  IsOptional,
  IsString,
  IsNumber,
  IsIn,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateModuleDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  teacherId?: string;

  @IsOptional()
  @IsString()
  teacherName?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  duration?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  fee?: number;

  @IsOptional()
  @IsString()
  batch?: string;

  @IsOptional()
  @IsIn(['active', 'inactive'])
  status?: 'active' | 'inactive';
}