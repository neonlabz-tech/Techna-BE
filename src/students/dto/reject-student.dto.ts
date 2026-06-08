import { IsNotEmpty, IsString, MinLength, Matches } from 'class-validator';
import { Transform } from 'class-transformer';

export class RejectStudentDto {
  @Transform(({ value }) => value?.trim())
  @IsString()
  @IsNotEmpty({ message: 'A rejection reason is required' })
  @MinLength(3, { message: 'Rejection reason must be at least 3 characters' })
  @Matches(/\S/, { message: 'Rejection reason cannot be empty or whitespace only' })
  reason: string;
}