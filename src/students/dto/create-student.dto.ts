import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Used by the Admin when creating a student directly (bypassing the public
 * registration form). All fields that are required in the schema must be
 * present here.
 */
export class CreateStudentDto {
  @ApiProperty({ example: 'Kasun Perera' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'kasun.perera@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '0771234567' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ example: '2026 A/L' })
  @IsString()
  @IsNotEmpty()
  batch: string;

  @ApiPropertyOptional({ example: ['Advanced ICT', 'Mathematics'], type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  modules?: string[];

  @ApiPropertyOptional({ example: 'No. 20, Lake Road, Kandy' })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({ example: '2008-05-20' })
  @IsString()
  @IsOptional()
  dob?: string;

  @ApiPropertyOptional({ example: 'https://example.com/avatar.jpg' })
  @IsString()
  @IsOptional()
  avatar?: string;

  @ApiPropertyOptional({ example: 'Nimal Perera' })
  @IsString()
  @IsOptional()
  parentName?: string;

  @ApiPropertyOptional({ example: '0712345678' })
  @IsString()
  @IsOptional()
  parentPhone?: string;
}
