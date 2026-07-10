import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

export class CreateModuleResultDto {
  @IsString()
  @IsNotEmpty()
  moduleName!: string;

  @IsEnum(['Mid exam', 'Final exam'])
  examType!: 'Mid exam' | 'Final exam';

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