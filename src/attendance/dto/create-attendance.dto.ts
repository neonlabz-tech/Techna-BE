import {
  IsString,
  IsEnum,
  IsNotEmpty,
  IsISO8601,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAttendanceDto {
  @ApiProperty({ example: '665f1b2c3d4e5f6789012345' })
  @IsString({ message: 'Student ID must be a string' })
  @IsNotEmpty({ message: 'Student ID is required' })
  readonly studentId!: string;

  @ApiProperty({ example: '665f1b2c3d4e5f6789019999' })
  @IsString({ message: 'Module ID must be a string' })
  @IsNotEmpty({ message: 'Module ID is required' })
  readonly moduleId!: string;

  @ApiProperty({ example: 'Advanced ICT' })
  @IsString({ message: 'Module name must be a string' })
  @IsNotEmpty({ message: 'Module name is required' })
  readonly moduleName!: string;

  @ApiProperty({ example: '2026-06-10' })
  @IsISO8601({ strict: true }, { message: 'Date must be a valid ISO8601 date' })
  @IsNotEmpty({ message: 'Date is required' })
  readonly date!: string;

  @ApiProperty({ enum: ['present', 'absent'], example: 'present' })
  @IsEnum(['present', 'absent'], { message: 'Status must be either present or absent' })
  @IsNotEmpty({ message: 'Status is required' })
  readonly status!: 'present' | 'absent';

  @ApiProperty({ example: '2026-06-10T09:30:00.000Z' })
  @IsISO8601({ strict: true }, { message: 'Marked at must be a valid ISO8601 datetime' })
  @IsNotEmpty({ message: 'Marked at is required' })
  readonly markedAt!: string;
}
