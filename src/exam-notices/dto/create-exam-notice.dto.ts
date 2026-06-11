import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateExamNoticeDto {
  @IsString({ message: 'Title must be a string' })
  @IsNotEmpty({ message: 'Title is required' })
  title: string;

  @IsString({ message: 'Module ID must be a string' })
  @IsNotEmpty({ message: 'Module ID is required' })
  moduleId: string;

  @IsString({ message: 'Module name must be a string' })
  @IsNotEmpty({ message: 'Module name is required' })
  moduleName: string;

  @IsString({ message: 'Batch must be a string' })
  @IsNotEmpty({ message: 'Batch is required' })
  batch: string;

  @IsString({ message: 'Date must be a string' })
  @IsNotEmpty({ message: 'Date is required' })
  date: string;

  @IsString({ message: 'Start time must be a string' })
  @IsNotEmpty({ message: 'Start time is required' })
  startTime: string;

  @IsString({ message: 'End time must be a string' })
  @IsNotEmpty({ message: 'End time is required' })
  endTime: string;

  @IsString({ message: 'Venue must be a string' })
  @IsNotEmpty({ message: 'Venue is required' })
  venue: string;

  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  description?: string;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean({ message: 'Published status must be a boolean' })
  isPublished?: boolean;
}