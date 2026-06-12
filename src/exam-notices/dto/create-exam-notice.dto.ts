import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  Min,
  IsIn,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateExamNoticeDto {
  @ApiProperty({ example: 'Final Term ICT Exam' })
  @IsString({ message: 'Title must be a string' })
  @IsNotEmpty({ message: 'Title is required' })
  title: string;

  @ApiProperty({ example: '665f1b2c3d4e5f6789019999' })
  @IsString({ message: 'Module ID must be a string' })
  @IsNotEmpty({ message: 'Module ID is required' })
  moduleId: string;

  @ApiProperty({ example: 'Advanced ICT' })
  @IsString({ message: 'Module name must be a string' })
  @IsNotEmpty({ message: 'Module name is required' })
  moduleName: string;

  @ApiProperty({ example: '2026 A/L' })
  @IsString({ message: 'Batch must be a string' })
  @IsNotEmpty({ message: 'Batch is required' })
  batch: string;

  @ApiProperty({ example: '2026-07-15' })
  @IsString({ message: 'Date must be a string' })
  @IsNotEmpty({ message: 'Date is required' })
  date: string;

  @ApiProperty({ example: '09:00' })
  @IsString({ message: 'Start time must be a string' })
  @IsNotEmpty({ message: 'Start time is required' })
  startTime: string;

  @ApiProperty({ example: '12:00' })
  @IsString({ message: 'End time must be a string' })
  @IsNotEmpty({ message: 'End time is required' })
  endTime: string;

  @ApiProperty({ example: 'Main Hall' })
  @IsString({ message: 'Venue must be a string' })
  @IsNotEmpty({ message: 'Venue is required' })
  venue: string;

  @ApiPropertyOptional({ example: 'Bring calculator and admission card.' })
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  description?: string;

  @ApiProperty({ example: 100, minimum: 0 })
  @Type(() => Number)
  @IsNumber({}, { message: 'Total marks must be a number' })
  @Min(0, { message: 'Total marks must be greater than or equal to 0' })
  totalMarks: number;

  @ApiProperty({
    enum: ['upcoming', 'ongoing', 'completed'],
    example: 'upcoming',
  })
  @IsString({ message: 'Status must be a string' })
  @IsIn(['upcoming', 'ongoing', 'completed'], {
    message: 'Status must be either upcoming, ongoing, or completed',
  })
  status: 'upcoming' | 'ongoing' | 'completed';

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean({ message: 'Published status must be a boolean' })
  isPublished?: boolean;
}
