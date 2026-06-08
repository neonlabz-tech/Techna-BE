import { IsNotEmpty, IsString } from 'class-validator';

export class RejectStudentDto {
  @IsString()
  @IsNotEmpty({ message: 'A rejection reason is required' })
  reason: string;
}