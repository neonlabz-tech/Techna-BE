import {
  IsString,
  IsEmail,
  IsOptional,
  IsEnum,
  IsNotEmpty,
  MinLength,
  IsISO8601,
  IsArray,
  ArrayMaxSize,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTeacherDto {
  @ApiProperty({ example: 'John Silva', minLength: 2 })
  @IsString({ message: 'Full name must be a string' })
  @IsNotEmpty({ message: 'Full name is required' })
  @MinLength(2, { message: 'Full name must be at least 2 characters' })
  fullName!: string;

  @ApiProperty({ example: 'john.silva@example.com' })
  @IsEmail({}, { message: 'Email must be valid' })
  @IsNotEmpty({ message: 'Email is required' })
  email!: string;

  @ApiProperty({ example: '0771234567' })
  @IsString({ message: 'Phone must be a string' })
  @IsNotEmpty({ message: 'Phone is required' })
  phone!: string;

  @ApiPropertyOptional({ type: [String], example: ['ICT', 'Engineering Technology'], maxItems: 6 })
  @IsOptional()
  @IsArray({ message: 'Subject must be an array' })
  @IsString({ each: true, message: 'Each subject must be a string' })
  @ArrayMaxSize(6, { message: 'Maximum 6 subjects allowed' })
  subject?: string[];

  @ApiPropertyOptional({ example: 'BSc in ICT' })
  @IsOptional()
  @IsString({ message: 'Qualification must be a string' })
  qualification?: string;

  @ApiProperty({ example: '5 years' })
  @IsString({ message: 'Experience must be a string' })
  @IsNotEmpty({ message: 'Experience is required' })
  experience!: string;

  @ApiProperty({ example: 'No. 10, Main Street, Colombo' })
  @IsString({ message: 'Address must be a string' })
  @IsNotEmpty({ message: 'Address is required' })
  address!: string;

  @ApiProperty({ example: '2026-06-10' })
  @IsISO8601({ strict: true }, { message: 'Join date must be a valid ISO8601 date' })
  @IsNotEmpty({ message: 'Join date is required' })
  joinDate!: string;

  @ApiPropertyOptional({ enum: ['active', 'inactive'], example: 'active' })
  @IsOptional()
  @IsEnum(['active', 'inactive'], { message: 'Status must be either active or inactive' })
  status?: 'active' | 'inactive';

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  password?: string;

  @ApiPropertyOptional({ example: 'Sarah' })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional({ example: 'Chen' })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional({ type: [String], example: ['MSc Computer Science', 'BSc ICT'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  degree?: string[];

  @ApiPropertyOptional({ type: [String], example: ['Machine Learning', 'Cloud Computing'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  specializations?: string[];

  @ApiPropertyOptional({ type: [String], example: ['Best Teacher Award 2024'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  awards?: string[];

  @ApiPropertyOptional({ type: [String], example: ['Published research paper'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  achievements?: string[];

  @ApiPropertyOptional({ example: 'Passionate educator with 10 years of experience.' })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  biography?: string;
}
