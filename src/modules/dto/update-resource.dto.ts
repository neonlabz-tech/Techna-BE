import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateResourceDto {
  @ApiProperty({ example: 'Updated lecture notes' })
  @IsString()
  @IsNotEmpty()
  title: string;
}
