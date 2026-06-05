import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class CreateAttendanceDto {
  @IsString()
  @IsNotEmpty()
  readonly studentId!: string;

  @IsString()
  @IsNotEmpty()
  readonly moduleId!: string;

  @IsString()
  @IsNotEmpty()
  readonly moduleName!: string;

  @IsString()
  @IsNotEmpty()
  readonly date!: string;

  @IsString()
  @IsIn(['present', 'absent'])
  readonly status!: 'present' | 'absent';

  @IsString()
  @IsNotEmpty()
  readonly markedAt!: string;
}
