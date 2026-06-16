import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsDateString,
  Matches,
  Max,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';

export class OlResultRowDto {
  @ApiProperty({ example: '2024' })
  @IsString()
  @IsNotEmpty()
  year!: string;

  @ApiProperty({ example: '12345678' })
  @IsString()
  @IsNotEmpty()
  indexNumber!: string;

  @ApiPropertyOptional({ example: 'A' })
  @IsOptional()
  @IsString()
  english?: string;

  @ApiPropertyOptional({ example: 'B' })
  @IsOptional()
  @IsString()
  mathematics?: string;

  @ApiPropertyOptional({ example: 'C' })
  @IsOptional()
  @IsString()
  science?: string;

  @ApiPropertyOptional({ example: 'A' })
  @IsOptional()
  @IsString()
  sinhala?: string;

  @ApiPropertyOptional({ example: 'B' })
  @IsOptional()
  @IsString()
  tamil?: string;
}

export class AccountSectionDto {
  @ApiProperty({ example: 'kasun.perera@example.com' })
  @IsEmail({}, { message: 'A valid email address is required' })
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ example: 'password123', minLength: 6 })
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  @IsNotEmpty()
  password!: string;
}

export class PersonalSectionDto {
  @ApiPropertyOptional({ example: 'Kasun Perera Tamil Name' })
  @IsOptional()
  @IsString()
  fullNameTamil?: string;

  @ApiProperty({ example: 'Kasun Perera' })
  @IsString()
  @IsNotEmpty({ message: 'Full name in English is required' })
  fullNameEnglish!: string;

  @ApiPropertyOptional({ example: '2008-05-20' })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @ApiPropertyOptional({ example: 20, minimum: 1, maximum: 31 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(31)
  dobDay?: number;

  @ApiPropertyOptional({ example: 5, minimum: 1, maximum: 12 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(12)
  dobMonth?: number;

  @ApiPropertyOptional({ example: 2008, minimum: 1900 })
  @IsOptional()
  @IsInt()
  @Min(1900)
  @Max(new Date().getFullYear())
  dobYear?: number;

  @ApiProperty({ example: '200812345678' })
  @IsString()
  @IsNotEmpty({ message: 'NIC number is required' })
  nicNo!: string;

  @ApiPropertyOptional({ example: 'Central College' })
  @IsOptional()
  @IsString()
  school?: string;

  @ApiProperty({ example: '0771234567' })
  @IsString()
  @IsNotEmpty({ message: 'WhatsApp number is required' })
  @Matches(/^(?:\+94|0094|0)[0-9]{9}$/, {
    message: 'Invalid WhatsApp number - use format: 0771234567 or +94771234567',
  })
  whatsappNo!: string;

  @ApiPropertyOptional({ example: '0712345678' })
  @IsOptional()
  @IsString()
  parentsNo?: string;

  @ApiProperty({ example: 'No. 20, Lake Road, Kandy' })
  @IsString()
  @IsNotEmpty({ message: 'Permanent address is required' })
  permanentAddress!: string;

  @ApiProperty({ example: 'Kandy' })
  @IsString()
  administrativeDistrict!: string;

  @ApiPropertyOptional({ example: '0812223344' })
  @IsOptional()
  @IsString()
  fixedTelephone?: string;

  @ApiPropertyOptional({ example: '2015' })
  @IsOptional()
  @IsString()
  residingSince?: string;

  @ApiPropertyOptional({ example: 'Sinhala' })
  @IsOptional()
  @IsString()
  race?: string;

  @ApiPropertyOptional({ example: 'Buddhism' })
  @IsOptional()
  @IsString()
  religion?: string;

  @ApiPropertyOptional({ example: 'YES' })
  @IsOptional()
  @IsString()
  citizenByDescent?: string;

  @ApiPropertyOptional({ example: 'No. 25, School Road, Kandy' })
  @IsOptional()
  @IsString()
  contactAddress?: string;

  @ApiPropertyOptional({ example: '20000' })
  @IsOptional()
  @IsString()
  postalCode?: string;
}

export class ParentSectionDto {
  @ApiPropertyOptional({ example: 'Nimal Perera' })
  @IsOptional()
  @IsString()
  fatherName?: string;

  @ApiPropertyOptional({ example: 'Kumari Perera' })
  @IsOptional()
  @IsString()
  motherName?: string;

  @ApiPropertyOptional({ example: 'Sunil Perera' })
  @IsOptional()
  @IsString()
  guardianName?: string;

  @ApiPropertyOptional({ example: 'Father' })
  @IsOptional()
  @IsString()
  contactPerson?: string;

  @ApiPropertyOptional({ example: 'No. 20, Lake Road, Kandy' })
  @IsOptional()
  @IsString()
  guardianAddress?: string;

  @ApiPropertyOptional({ example: '0812223344' })
  @IsOptional()
  @IsString()
  guardianFixedTel?: string;

  @ApiPropertyOptional({ example: '0712345678' })
  @IsOptional()
  @IsString()
  guardianMobile?: string;
}

export class OlRecordsSectionDto {
  @ApiPropertyOptional({ example: 'Local O/L' })
  @IsOptional()
  @IsString()
  olCategory?: string;

  @ApiPropertyOptional({ example: '2024' })
  @IsOptional()
  @IsString()
  olYear?: string;

  @ApiPropertyOptional({ example: '12345678' })
  @IsOptional()
  @IsString()
  olIndexNumber?: string;

  @ApiPropertyOptional({ example: 'Kasun Perera' })
  @IsOptional()
  @IsString()
  olNameUsed?: string;

  @ApiPropertyOptional({ example: 'Accept' })
  @IsOptional()
  @IsString()
  olAccept?: string;

  @ApiPropertyOptional({ type: [OlResultRowDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OlResultRowDto)
  olResults?: OlResultRowDto[];
}

export class SubjectSectionDto {
  @ApiProperty({ isArray: true, example: ['Information Communication Technology'] })
  @IsArray()
  @ArrayMinSize(1, { message: 'At least one subject must be selected' })
  @IsString({ each: true })
  subjects!: string[];

  @ApiProperty({ example: true })
  @IsBoolean({ message: 'You must agree to the terms to submit' })
  agreed!: boolean;
}

export class RegisterStudentDto {
  @ApiProperty({ type: AccountSectionDto })
  @ValidateNested()
  @Type(() => AccountSectionDto)
  @IsNotEmpty()
  account!: AccountSectionDto;

  @ApiProperty({ type: PersonalSectionDto })
  @ValidateNested()
  @Type(() => PersonalSectionDto)
  @IsNotEmpty()
  personal!: PersonalSectionDto;

  @ApiPropertyOptional({ type: ParentSectionDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => ParentSectionDto)
  parent?: ParentSectionDto;

  @ApiPropertyOptional({ type: OlRecordsSectionDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => OlRecordsSectionDto)
  olRecords?: OlRecordsSectionDto;

  @ApiProperty({ type: SubjectSectionDto })
  @ValidateNested()
  @Type(() => SubjectSectionDto)
  @IsNotEmpty()
  subjectSelection!: SubjectSectionDto;

  @ApiPropertyOptional({ example: '2026 A/L' })
  @IsOptional()
  @IsString()
  batch?: string;
}
