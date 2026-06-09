import { IsIn, IsOptional, IsString } from 'class-validator';

export class UpdateAttendanceDto {
  @IsOptional()
  @IsString()
  readonly studentId?: string;

  @IsOptional()
  @IsString()
  readonly moduleId?: string;

  @IsOptional()
  @IsString()
  readonly moduleName?: string;

  @IsOptional()
  @IsString()
  readonly date?: string;

  @IsOptional()
  @IsString()
  @IsIn(['present', 'absent'])
  readonly status?: 'present' | 'absent';

  @IsOptional()
  @IsString()
  readonly markedAt?: string;
}
