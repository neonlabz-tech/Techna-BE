import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ScanQrDto {
  @ApiProperty({ example: 'qr-token-from-student-card' })
  @IsString()
  @IsNotEmpty()
  readonly qrToken!: string;

  @ApiPropertyOptional({ example: '665f1b2c3d4e5f6789019999' })
  @IsOptional()
  @IsString()
  @IsMongoId()
  readonly moduleId?: string;
}
