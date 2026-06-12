import { IsIn, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateAttendanceDto {
  @ApiPropertyOptional({ example: '665f1b2c3d4e5f6789012345' })
  @IsOptional()
  @IsString()
  readonly studentId?: string;

  @ApiPropertyOptional({ example: '665f1b2c3d4e5f6789019999' })
  @IsOptional()
  @IsString()
  readonly moduleId?: string;

  @ApiPropertyOptional({ example: 'Advanced ICT' })
  @IsOptional()
  @IsString()
  readonly moduleName?: string;

  @ApiPropertyOptional({ example: '2026-06-10' })
  @IsOptional()
  @IsString()
  readonly date?: string;

  @ApiPropertyOptional({ enum: ['present', 'absent'], example: 'present' })
  @IsOptional()
  @IsString()
  @IsIn(['present', 'absent'])
  readonly status?: 'present' | 'absent';

  @ApiPropertyOptional({ example: '2026-06-10T09:30:00.000Z' })
  @IsOptional()
  @IsString()
  readonly markedAt?: string;
}
