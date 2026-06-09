import { Type } from 'class-transformer';
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

import {
  AlSubject,
  District,
  OlGrade,
} from '../schemas/student.schema';

// ─────────────────────────────────────────────────────────────────────────────
// O/L Result Row
// ─────────────────────────────────────────────────────────────────────────────
export class OlResultRowDto {
  @IsString()
  @IsNotEmpty()
  year: string;

  @IsString()
  @IsNotEmpty()
  indexNumber: string;

  @IsOptional()
  @IsEnum(OlGrade)
  english?: string;

  @IsOptional()
  @IsEnum(OlGrade)
  mathematics?: string;

  @IsOptional()
  @IsEnum(OlGrade)
  science?: string;

  @IsOptional()
  @IsEnum(OlGrade)
  sinhala?: string;

  @IsOptional()
  @IsEnum(OlGrade)
  tamil?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Section A — Account credentials
// ─────────────────────────────────────────────────────────────────────────────
export class AccountSectionDto {
  @IsEmail({}, { message: 'A valid email address is required' })
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  @IsNotEmpty()
  password: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Section B — Personal details
// ─────────────────────────────────────────────────────────────────────────────
export class PersonalSectionDto {
  @IsOptional()
  @IsString()
  fullNameTamil?: string;

  @IsString()
  @IsNotEmpty({ message: 'Full name in English is required' })
  fullNameEnglish: string; // uppercased in service

  // Date of birth — accept as full ISO string OR as day/month/year parts
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(31)
  dobDay?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(12)
  dobMonth?: number;

  @IsOptional()
  @IsInt()
  @Min(1900)
  @Max(new Date().getFullYear())
  dobYear?: number;

  @IsString()
  @IsNotEmpty({ message: 'NIC number is required' })
  nicNo: string;

  @IsOptional()
  @IsString()
  school?: string;

  @IsString()
  @IsNotEmpty({ message: 'WhatsApp number is required' })
  @Matches(/^(?:\+94|0094|0)[0-9]{9}$/, {
    message:
      'Invalid WhatsApp number — use format: 0771234567 or +94771234567',
  })
  whatsappNo: string;

  @IsOptional()
  @IsString()
  parentsNo?: string;

  @IsString()
  @IsNotEmpty({ message: 'Permanent address is required' })
  permanentAddress: string;

  @IsEnum(District, {
    message: `administrativeDistrict must be a valid Sri Lankan district`,
  })
  administrativeDistrict: string;

  @IsOptional()
  @IsString()
  fixedTelephone?: string;

  @IsOptional()
  @IsString()
  residingSince?: string;

  @IsOptional()
  @IsIn(['Sinhala', 'Tamil', 'Muslim', 'Burgher', 'Malay', 'Other'])
  race?: string;

  @IsOptional()
  @IsIn(['Buddhism', 'Hinduism', 'Islam', 'Christianity(RC/Non.RC)', 'Other'])
  religion?: string;

  @IsOptional()
  @IsIn(['YES', 'NO'])
  citizenByDescent?: string;

  @IsOptional()
  @IsString()
  contactAddress?: string;

  @IsOptional()
  @IsString()
  postalCode?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Section C — Parent / Guardian details
// ─────────────────────────────────────────────────────────────────────────────
export class ParentSectionDto {
  @IsOptional()
  @IsString()
  fatherName?: string;

  @IsOptional()
  @IsString()
  motherName?: string;

  @IsOptional()
  @IsString()
  guardianName?: string;

  @IsOptional()
  @IsIn(['Father', 'Mother', 'Guardian'])
  contactPerson?: string;

  @IsOptional()
  @IsString()
  guardianAddress?: string;

  @IsOptional()
  @IsString()
  guardianFixedTel?: string;

  @IsOptional()
  @IsString()
  guardianMobile?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Section D — O/L academic records
// ─────────────────────────────────────────────────────────────────────────────
export class OlRecordsSectionDto {
  @IsOptional()
  @IsIn(['Local O/L', 'London O/L'])
  olCategory?: string;

  @IsOptional()
  @IsString()
  olYear?: string;

  @IsOptional()
  @IsString()
  olIndexNumber?: string;

  @IsOptional()
  @IsString()
  olNameUsed?: string; // uppercased in service

  @IsOptional()
  @IsIn(['Accept', 'Change'])
  olAccept?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OlResultRowDto)
  olResults?: OlResultRowDto[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Section E — A/L subject selection
// ─────────────────────────────────────────────────────────────────────────────
export class SubjectSectionDto {
  @IsArray()
  @ArrayMinSize(1, { message: 'At least one subject must be selected' })
  @IsEnum(AlSubject, {
    each: true,
    message: `Each subject must be one of: ${Object.values(AlSubject).join(', ')}`,
  })
  subjects: string[];

  @IsBoolean({ message: 'You must agree to the terms to submit' })
  agreed: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// Root DTO — wraps all five sections
// ─────────────────────────────────────────────────────────────────────────────
export class RegisterStudentDto {
  // Section A
  @ValidateNested()
  @Type(() => AccountSectionDto)
  @IsNotEmpty()
  account: AccountSectionDto;

  // Section B
  @ValidateNested()
  @Type(() => PersonalSectionDto)
  @IsNotEmpty()
  personal: PersonalSectionDto;

  // Section C (optional — not all students have guardian details)
  @IsOptional()
  @ValidateNested()
  @Type(() => ParentSectionDto)
  parent?: ParentSectionDto;

  // Section D (optional — student may not have OL results yet)
  @IsOptional()
  @ValidateNested()
  @Type(() => OlRecordsSectionDto)
  olRecords?: OlRecordsSectionDto;

  // Section E
  @ValidateNested()
  @Type(() => SubjectSectionDto)
  @IsNotEmpty()
  subjectSelection: SubjectSectionDto;

  // ── Backward-compatible fields (still work for simple registration) ────────
  // These are kept so existing simple registrations don't break.
  // When the full form is submitted, these are derived from the sections above.

  @IsOptional()
  @IsString()
  batch?: string;
}