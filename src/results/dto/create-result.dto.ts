import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

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

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateModuleResultDto)
  modules!: CreateModuleResultDto[];
}