import {
  IsString,
  IsNumber,
  IsEnum,
  IsNotEmpty,
  IsPositive,
  MinLength,
} from 'class-validator';

export class CreateModuleDto {
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  @MinLength(2, { message: 'Name must be at least 2 characters' })
  name: string;

  @IsString({ message: 'Teacher ID must be a string' })
  @IsNotEmpty({ message: 'Teacher ID is required' })
  teacherId: string;

  @IsString({ message: 'Teacher name must be a string' })
  @IsNotEmpty({ message: 'Teacher name is required' })
  teacherName: string;

  @IsString({ message: 'Description must be a string' })
  @IsNotEmpty({ message: 'Description is required' })
  description: string;

  @IsString({ message: 'Duration must be a string' })
  @IsNotEmpty({ message: 'Duration is required' })
  duration: string;

  @IsNumber({}, { message: 'Fee must be a number' })
  @IsNotEmpty({ message: 'Fee is required' })
  @IsPositive({ message: 'Fee must be greater than 0' })
  fee: number;

  @IsString({ message: 'Batch must be a string' })
  @IsNotEmpty({ message: 'Batch is required' })
  batch: string;

  @IsEnum(['active', 'inactive'], { message: 'Status must be either active or inactive' })
  @IsNotEmpty({ message: 'Status is required' })
  status: 'active' | 'inactive';
}
