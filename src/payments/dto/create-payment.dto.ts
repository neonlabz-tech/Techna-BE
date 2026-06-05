import { Type } from 'class-transformer';
import { IsIn, IsNumber, IsOptional, IsString, Matches, Min } from 'class-validator';

export class CreatePaymentDto {
  @IsString()
  studentId: string;

  @IsOptional()
  @IsString()
  studentName?: string;

  @IsString()
  moduleId: string;

  @IsOptional()
  @IsString()
  moduleName?: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  amount: number;

  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  paidDate: string;

  @IsIn(['cash', 'bank', 'online'])
  method: 'cash' | 'bank' | 'online';

  @IsOptional()
  @IsIn(['paid', 'pending', 'overdue'])
  status?: 'paid' | 'pending' | 'overdue';

  @IsOptional()
  @IsString()
  receiptNo?: string;

  @IsString()
  batch: string;
}