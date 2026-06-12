import {
  IsOptional,
  IsString,
  IsNumber,
  IsIn,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateModuleDto {
  @ApiPropertyOptional({ example: 'Advanced ICT' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: '665f1b2c3d4e5f6789012345' })
  @IsOptional()
  @IsString()
  teacherId?: string;

  @ApiPropertyOptional({ example: 'John Silva' })
  @IsOptional()
  @IsString()
  teacherName?: string;

  @ApiPropertyOptional({ example: 'Updated A/L ICT module details' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: '8 months' })
  @IsOptional()
  @IsString()
  duration?: string;

  @ApiPropertyOptional({ example: 30000 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  fee?: number;

  @ApiPropertyOptional({ example: '2026 A/L' })
  @IsOptional()
  @IsString()
  batch?: string;

  @ApiPropertyOptional({ enum: ['active', 'inactive'], example: 'active' })
  @IsOptional()
  @IsIn(['active', 'inactive'])
  status?: 'active' | 'inactive';
}
