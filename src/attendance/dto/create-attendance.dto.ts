import {
  IsString,
  IsEnum,
  IsNotEmpty,
  IsISO8601,
} from 'class-validator';

export class CreateAttendanceDto {
  @IsString({ message: 'Student ID must be a string' })
  @IsNotEmpty({ message: 'Student ID is required' })
  readonly studentId!: string;

  @IsString({ message: 'Module ID must be a string' })
  @IsNotEmpty({ message: 'Module ID is required' })
  readonly moduleId!: string;

  @IsString({ message: 'Module name must be a string' })
  @IsNotEmpty({ message: 'Module name is required' })
  readonly moduleName!: string;

  @IsISO8601({ strict: true }, { message: 'Date must be a valid ISO8601 date' })
  @IsNotEmpty({ message: 'Date is required' })
  readonly date!: string;

  @IsEnum(['present', 'absent'], { message: 'Status must be either present or absent' })
  @IsNotEmpty({ message: 'Status is required' })
  readonly status!: 'present' | 'absent';

  @IsISO8601({ strict: true }, { message: 'Marked at must be a valid ISO8601 datetime' })
  @IsNotEmpty({ message: 'Marked at is required' })
  readonly markedAt!: string;
}
