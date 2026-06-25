import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateStudentDto {

  @ApiPropertyOptional({ example: 'Name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'Tamil Name' })
  @IsString()
  @IsOptional()
  fullNameTamil?: string;

  @ApiPropertyOptional({ example: 'Full Name' })
  @IsString()
  @IsOptional()
  fullNameEnglish?: string;

  @ApiProperty({ example: 'mail@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '0771234567' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiPropertyOptional({ example: '0771234567' })
  @IsString()
  @IsOptional()
  @Matches(/^[0-9]{9,10}$/, {
    message: 'Enter a valid phone number (9–10 digits)',
  })
  whatsappNo?: string;

  @ApiPropertyOptional({ example: '0712345678' })
  @IsString()
  @IsOptional()
  parentsNo?: string;

  @ApiProperty({ example: '2026 A/L' })
  @IsString()
  @IsNotEmpty()
  batch: string;

  @ApiPropertyOptional({
    example: ['Advanced ICT', 'Mathematics'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  modules?: string[];

  @ApiPropertyOptional({
    example: ['Science', 'Maths'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  subjects?: string[];

  @ApiPropertyOptional({ example: '123 Main St, Jaffna' })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({ example: 'Jaffna' })
  @IsString()
  @IsOptional()
  @IsNotEmpty({ message: 'Address is required' })
  permanentAddress?: string;

  @ApiPropertyOptional({ example: 'Jaffna' })
  @IsString()
  @IsOptional()
  contactAddress?: string;

  @ApiPropertyOptional({ example: 'Jaffna District' })
  @IsString()
  @IsOptional()
  administrativeDistrict?: string;

  @ApiPropertyOptional({ example: '40000' })
  @IsString()
  @IsOptional()
  postalCode?: string;

  // @ApiPropertyOptional({ example: '2005-01-01' })
  // @IsString()
  // @IsOptional()
  // dob?: string;

  @ApiPropertyOptional({ example: '2005-01-01' })
  @IsString()
  @IsOptional()
  dateOfBirth?: string;

  @ApiPropertyOptional({ example: '200090423680' })
  @IsString()
  @IsOptional()
  @Matches(/^([0-9]{9}[vVxX]|[0-9]{12})$/, {
    message: 'Enter a valid NIC number (e.g. 991234567V or 199912345678)',
  })
  nicNo?: string;

  @ApiPropertyOptional({ example: 'Central College' })
  @IsString()
  @IsOptional()
  school?: string;

  @ApiPropertyOptional({ example: 'https://example.com/avatar.jpg' })
  @IsString()
  @IsOptional()
  avatar?: string;

  @ApiPropertyOptional({ example: 'Nimal Perera' })
  @IsString()
  @IsOptional()
  parentName?: string;

  @ApiPropertyOptional({ example: '0712345678' })
  @IsString()
  @IsOptional()
  parentPhone?: string;

  @ApiPropertyOptional({ example: 'Father Name' })
  @IsString()
  @IsOptional()
  fatherName?: string;

  @ApiPropertyOptional({ example: 'Mother Name' })
  @IsString()
  @IsOptional()
  motherName?: string;

  @ApiPropertyOptional({ example: 'Guardian Name' })
  @IsString()
  @IsOptional()
  guardianName?: string;

  @ApiPropertyOptional({ example: '0712345678' })
  @IsString()
  @IsOptional()
  guardianMobile?: string;

  @ApiPropertyOptional({ example: '0712345678' })
  @IsString()
  @IsOptional()
  fixedTelephone?: string;

  @ApiPropertyOptional({ example: '2005-01-01' })
  @IsString()
  @IsOptional()
  residingSince?: string;

  @ApiPropertyOptional({ example: 'Srilankan Tamil' })
  @IsString()
  @IsOptional()
  race?: string;

  @ApiPropertyOptional({ example: 'Hinduism' })
  @IsString()
  @IsOptional()
  religion?: string;

  @ApiPropertyOptional({ example: 'YES' })
  @IsString()
  @IsOptional()
  citizenByDescent?: string;

  @ApiPropertyOptional({ example: 'Jaffna' })
  @IsString()
  @IsOptional()
  guardianAddress?: string;

  @ApiPropertyOptional({ example: '0712345678' })
  @IsString()
  @IsOptional()
  guardianFixedTel?: string;

  @ApiPropertyOptional({ example: 'Father' })
  @IsString()
  @IsOptional()
  contactPerson?: string;

  @ApiPropertyOptional({ example: 'Local O/L' })
  @IsString()
  @IsOptional()
  olCategory?: string;

  @ApiPropertyOptional({ example: '2024' })
  @IsString()
  @IsOptional()
  olYear?: string;

  @ApiPropertyOptional({ example: '12345678' })
  @IsString()
  @IsOptional()
  olIndexNumber?: string;

  @ApiPropertyOptional({ example: 'Name'})
  @IsString()
  @IsOptional()
  olNameUsed?: string;

  @ApiPropertyOptional({ example: 'Accept' })
  @IsString()
  @IsOptional()
  olAccept?: string;

  @ApiPropertyOptional({ example: [] })
  @IsArray()
  @IsOptional()
  olResults?: any[];

  @ApiPropertyOptional({ example: 'password123' })
  @IsString()
  @IsOptional()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  password?: string;
}