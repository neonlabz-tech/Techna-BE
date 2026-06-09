import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ScanQrDto {
  @IsString()
  @IsNotEmpty()
  readonly qrToken!: string;

  @IsOptional()
  @IsString()
  @IsMongoId()
  readonly moduleId?: string;
}
