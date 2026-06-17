import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateContactDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  name!: string;

  @ApiProperty({ example: 'john@example.com' })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email!: string;

  @ApiProperty({ example: '077-1234567', required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ example: 'Course Information' })
  @IsString()
  @IsNotEmpty({ message: 'Subject is required' })
  subject!: string;

  @ApiProperty({ example: 'I would like to know more about your courses.' })
  @IsString()
  @IsNotEmpty({ message: 'Message is required' })
  message!: string;
}
