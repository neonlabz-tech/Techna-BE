import {
  IsString,
  IsNumber,
  IsEnum,
  IsNotEmpty,
  IsPositive,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateModuleDto {
  @ApiProperty({ example: 'Advanced ICT', minLength: 3 })
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  @MinLength(3, { message: 'Name must be at least 3 characters' })
  name!: string;

  @ApiProperty({ example: '665f1b2c3d4e5f6789012345' })
  @IsString({ message: 'Teacher ID must be a string' })
  @IsNotEmpty({ message: 'Teacher ID is required' })
  teacherId!: string;

  @ApiProperty({ example: 'John Silva' })
  @IsString({ message: 'Teacher name must be a string' })
  @IsNotEmpty({ message: 'Teacher name is required' })
  teacherName!: string;

  @ApiProperty({ example: 'A/L ICT theory and practical module' })
  @IsString({ message: 'Description must be a string' })
  @IsNotEmpty({ message: 'Description is required' })
  @MinLength(3, { message: 'Description must be at least 3 characters' })
  description!: string;

  @ApiProperty({ example: '6 months' })
  @IsString({ message: 'Duration must be a string' })
  @IsNotEmpty({ message: 'Duration is required' })
  duration!: string;

  @ApiProperty({ example: 25000 })
  @IsNumber({}, { message: 'Fee must be a number' })
  @IsNotEmpty({ message: 'Fee is required' })
  @IsPositive({ message: 'Fee must be greater than 0' })
  fee!: number;

  @ApiProperty({ example: '2026 A/L' })
  @IsString({ message: 'Batch must be a string' })
  @IsNotEmpty({ message: 'Batch is required' })
  batch!: string;

  @ApiProperty({ enum: ['active', 'inactive'], example: 'active' })
  @IsEnum(['active', 'inactive'], { message: 'Status must be either active or inactive' })
  @IsNotEmpty({ message: 'Status is required' })
  status!: 'active' | 'inactive';
}
