import { IsIn, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateModuleDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  teacherId: string;

  @IsString()
  @IsNotEmpty()
  teacherName: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  duration: string;

  @IsNumber()
  fee: number;

  @IsString()
  @IsNotEmpty()
  batch: string;

  @IsIn(['active', 'inactive'])
  status: 'active' | 'inactive';
}