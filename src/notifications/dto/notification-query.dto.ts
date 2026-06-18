import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { NotificationType } from '../schemas/notification.schema';

export class NotificationQueryDto {
  @ApiPropertyOptional({ enum: NotificationType })
  @IsEnum(NotificationType)
  @IsOptional()
  readonly type?: NotificationType;

  @ApiPropertyOptional({ example: '2024-A' })
  @IsString()
  @IsOptional()
  readonly batch?: string;

  @ApiPropertyOptional({ example: 'true' })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  readonly unreadOnly?: boolean;

  @ApiPropertyOptional({ example: 20 })
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10) || 20)
  readonly limit?: number;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10) || 0)
  readonly skip?: number;
}
