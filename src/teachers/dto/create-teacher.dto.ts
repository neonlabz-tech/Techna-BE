import {
  IsString,
  IsEmail,
  IsPhoneNumber,
  IsOptional,
  IsEnum,
  IsNotEmpty,
  MinLength,
  IsISO8601,
} from 'class-validator';

export class CreateTeacherDto {
  @IsString({ message: 'Full name must be a string' })
  @IsNotEmpty({ message: 'Full name is required' })
  @MinLength(2, { message: 'Full name must be at least 2 characters' })
  fullName: string;

  @IsEmail({}, { message: 'Email must be valid' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsString({ message: 'Phone must be a string' })
  @IsNotEmpty({ message: 'Phone is required' })
  phone: string;

  @IsString({ message: 'Subject must be a string' })
  @IsNotEmpty({ message: 'Subject is required' })
  subject: string;

  @IsString({ message: 'Qualification must be a string' })
  @IsNotEmpty({ message: 'Qualification is required' })
  qualification: string;

  @IsString({ message: 'Experience must be a string' })
  @IsNotEmpty({ message: 'Experience is required' })
  experience: string;

  @IsString({ message: 'Address must be a string' })
  @IsNotEmpty({ message: 'Address is required' })
  address: string;

  @IsISO8601({ strict: true }, { message: 'Join date must be a valid ISO8601 date' })
  @IsNotEmpty({ message: 'Join date is required' })
  joinDate: string;

  @IsOptional()
  @IsEnum(['active', 'inactive'], { message: 'Status must be either active or inactive' })
  status?: 'active' | 'inactive';
}