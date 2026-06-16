import { Type } from 'class-transformer';
import { IsIn, IsNumber, IsOptional, IsString, Matches, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePaymentDto {
  @ApiProperty({ example: '665f1b2c3d4e5f6789012345' })
  @IsString()
  studentId!: string;

  @ApiPropertyOptional({ example: 'Kasun Perera' })
  @IsOptional()
  @IsString()
  studentName?: string;

  @ApiProperty({ example: '665f1b2c3d4e5f6789019999' })
  @IsString()
  moduleId!: string;

  @ApiPropertyOptional({ example: 'Advanced ICT' })
  @IsOptional()
  @IsString()
  moduleName?: string;

  @ApiProperty({ example: 15000, minimum: 0 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  amount!: number;

  @ApiProperty({ example: '2026-06-10', pattern: '^\\d{4}-\\d{2}-\\d{2}$' })
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  paidDate!: string;

  @ApiProperty({ enum: ['cash', 'bank', 'online'], example: 'cash' })
  @IsIn(['cash', 'bank', 'online'])
  method!: 'cash' | 'bank' | 'online';

  @ApiPropertyOptional({ enum: ['paid', 'pending', 'overdue'], example: 'paid' })
  @IsOptional()
  @IsIn(['paid', 'pending', 'overdue'])
  status?: 'paid' | 'pending' | 'overdue';

  @ApiPropertyOptional({ example: 'REC-2026-001' })
  @IsOptional()
  @IsString()
  receiptNo?: string;

  @ApiProperty({ example: '2026 A/L' })
  @IsString()
  batch!: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
