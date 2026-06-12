import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsIn,
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

import { AlSubject, District, OlGrade } from '../schemas/student.schema';

export class OlResultRowDto {
  @ApiProperty({ example: '2024' })
  @IsString()
  @IsNotEmpty()
  year: string;

  @ApiProperty({ example: '12345678' })
  @IsString()
  @IsNotEmpty()
  indexNumber: string;

  @ApiPropertyOptional({ enum: OlGrade, example: OlGrade.A })
  @IsOptional()
  @IsEnum(OlGrade)
  english?: string;

  @ApiPropertyOptional({ enum: OlGrade, example: OlGrade.B })
  @IsOptional()
  @IsEnum(OlGrade)
  mathematics?: string;

  @ApiPropertyOptional({ enum: OlGrade, example: OlGrade.C })
  @IsOptional()
  @IsEnum(OlGrade)
  science?: string;

  @ApiPropertyOptional({ enum: OlGrade, example: OlGrade.A })
  @IsOptional()
  @IsEnum(OlGrade)
  sinhala?: string;

  @ApiPropertyOptional({ enum: OlGrade, example: OlGrade.B })
  @IsOptional()
  @IsEnum(OlGrade)
  tamil?: string;
}

export class AccountSectionDto {
  @ApiProperty({ example: 'kasun.perera@example.com' })
  @IsEmail({}, { message: 'A valid email address is required' })
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'password123', minLength: 6 })
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  @IsNotEmpty()
  password: string;
}

export class PersonalSectionDto {
  @ApiPropertyOptional({ example: 'Kasun Perera Tamil Name' })
  @IsOptional()
  @IsString()
  fullNameTamil?: string;

  @ApiProperty({ example: 'Kasun Perera' })
  @IsString()
  @IsNotEmpty({ message: 'Full name in English is required' })
  fullNameEnglish: string;

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
  nicNo: string;

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
  whatsappNo: string;

  @ApiPropertyOptional({ example: '0712345678' })
  @IsOptional()
  @IsString()
  parentsNo?: string;

  @ApiProperty({ example: 'No. 20, Lake Road, Kandy' })
  @IsString()
  @IsNotEmpty({ message: 'Permanent address is required' })
  permanentAddress: string;

  @ApiProperty({ enum: District, example: District.KANDY })
  @IsEnum(District, {
    message: 'administrativeDistrict must be a valid Sri Lankan district',
  })
  administrativeDistrict: string;

  @ApiPropertyOptional({ example: '0812223344' })
  @IsOptional()
  @IsString()
  fixedTelephone?: string;

  @ApiPropertyOptional({ example: '2015' })
  @IsOptional()
  @IsString()
  residingSince?: string;

  @ApiPropertyOptional({
    enum: ['Sinhala', 'Tamil', 'Muslim', 'Burgher', 'Malay', 'Other'],
    example: 'Sinhala',
  })
  @IsOptional()
  @IsIn(['Sinhala', 'Tamil', 'Muslim', 'Burgher', 'Malay', 'Other'])
  race?: string;

  @ApiPropertyOptional({
    enum: ['Buddhism', 'Hinduism', 'Islam', 'Christianity(RC/Non.RC)', 'Other'],
    example: 'Buddhism',
  })
  @IsOptional()
  @IsIn(['Buddhism', 'Hinduism', 'Islam', 'Christianity(RC/Non.RC)', 'Other'])
  religion?: string;

  @ApiPropertyOptional({ enum: ['YES', 'NO'], example: 'YES' })
  @IsOptional()
  @IsIn(['YES', 'NO'])
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

  @ApiPropertyOptional({ enum: ['Father', 'Mother', 'Guardian'], example: 'Father' })
  @IsOptional()
  @IsIn(['Father', 'Mother', 'Guardian'])
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
  @ApiPropertyOptional({ enum: ['Local O/L', 'London O/L'], example: 'Local O/L' })
  @IsOptional()
  @IsIn(['Local O/L', 'London O/L'])
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

  @ApiPropertyOptional({ enum: ['Accept', 'Change'], example: 'Accept' })
  @IsOptional()
  @IsIn(['Accept', 'Change'])
  olAccept?: string;

  @ApiPropertyOptional({ type: [OlResultRowDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OlResultRowDto)
  olResults?: OlResultRowDto[];
}

export class SubjectSectionDto {
  @ApiProperty({ enum: AlSubject, isArray: true, example: [AlSubject.ICT] })
  @IsArray()
  @ArrayMinSize(1, { message: 'At least one subject must be selected' })
  @IsEnum(AlSubject, {
    each: true,
    message: `Each subject must be one of: ${Object.values(AlSubject).join(', ')}`,
  })
  subjects: string[];

  @ApiProperty({ example: true })
  @IsBoolean({ message: 'You must agree to the terms to submit' })
  agreed: boolean;
}

export class RegisterStudentDto {
  @ApiProperty({ type: AccountSectionDto })
  @ValidateNested()
  @Type(() => AccountSectionDto)
  @IsNotEmpty()
  account: AccountSectionDto;

  @ApiProperty({ type: PersonalSectionDto })
  @ValidateNested()
  @Type(() => PersonalSectionDto)
  @IsNotEmpty()
  personal: PersonalSectionDto;

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
  subjectSelection: SubjectSectionDto;

  @ApiPropertyOptional({ example: '2026 A/L' })
  @IsOptional()
  @IsString()
  batch?: string;
}
