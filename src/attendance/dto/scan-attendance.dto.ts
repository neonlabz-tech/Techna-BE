import {
  IsString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsISO8601,
} from 'class-validator';

export class ScanAttendanceDto {
  @IsString({ message: 'QR token must be a string' })
  @IsNotEmpty({ message: 'QR token is required' })
  readonly qrToken!: string;

  @IsString({ message: 'Module ID must be a string' })
  @IsNotEmpty({ message: 'Module ID is required' })
  readonly moduleId!: string;

  @IsString({ message: 'Module name must be a string' })
  @IsNotEmpty({ message: 'Module name is required' })
  readonly moduleName!: string;

  @IsEnum(['present', 'absent'], { message: 'Status must be either present or absent' })
  @IsOptional()
  readonly status?: 'present' | 'absent';

  @IsISO8601({ strict: true }, { message: 'Date must be a valid ISO8601 date' })
  @IsOptional()
  readonly date?: string;

  @IsISO8601({ strict: true }, { message: 'Marked at must be a valid ISO8601 datetime' })
  @IsOptional()
  readonly markedAt?: string;
}
