import {
  IsString,
  IsEmail,
  IsOptional,
  IsEnum,
  IsNotEmpty,
  MinLength,
  IsISO8601,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTeacherDto {
  @ApiProperty({ example: 'John Silva', minLength: 2 })
  @IsString({ message: 'Full name must be a string' })
  @IsNotEmpty({ message: 'Full name is required' })
  @MinLength(2, { message: 'Full name must be at least 2 characters' })
  fullName: string;

  @ApiProperty({ example: 'john.silva@example.com' })
  @IsEmail({}, { message: 'Email must be valid' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({ example: '0771234567' })
  @IsString({ message: 'Phone must be a string' })
  @IsNotEmpty({ message: 'Phone is required' })
  phone: string;

  @ApiProperty({ example: 'Information Communication Technology' })
  @IsString({ message: 'Subject must be a string' })
  @IsNotEmpty({ message: 'Subject is required' })
  subject: string;

  @ApiProperty({ example: 'BSc in ICT' })
  @IsString({ message: 'Qualification must be a string' })
  @IsNotEmpty({ message: 'Qualification is required' })
  qualification: string;

  @ApiProperty({ example: '5 years' })
  @IsString({ message: 'Experience must be a string' })
  @IsNotEmpty({ message: 'Experience is required' })
  experience: string;

  @ApiProperty({ example: 'No. 10, Main Street, Colombo' })
  @IsString({ message: 'Address must be a string' })
  @IsNotEmpty({ message: 'Address is required' })
  address: string;

  @ApiProperty({ example: '2026-06-10' })
  @IsISO8601({ strict: true }, { message: 'Join date must be a valid ISO8601 date' })
  @IsNotEmpty({ message: 'Join date is required' })
  joinDate: string;

  @ApiPropertyOptional({ enum: ['active', 'inactive'], example: 'active' })
  @IsOptional()
  @IsEnum(['active', 'inactive'], { message: 'Status must be either active or inactive' })
  status?: 'active' | 'inactive';
}
