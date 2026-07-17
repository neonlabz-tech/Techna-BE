import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { EXAM_TYPES } from '../exam-types';
import type { ExamType } from '../exam-types';

export class CreateModuleResultDto {
  @IsString()
  @IsNotEmpty()
  moduleName!: string;

  @IsIn(EXAM_TYPES)
  examType!: ExamType;

  @IsNumber()
  @Min(0)
  @Max(100)
  marks!: number;
}

export class CreateResultDto {
  @IsString()
  @IsNotEmpty()
  studentId!: string;

  @IsOptional()
  @IsDateString()
  date?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateModuleResultDto)
  modules!: CreateModuleResultDto[];
}