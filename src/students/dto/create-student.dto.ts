import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateStudentDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  fullNameTamil?: string;

  @IsString()
  @IsOptional()
  fullNameEnglish?: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsOptional()
  whatsappNo?: string;

  @IsString()
  @IsOptional()
  parentsNo?: string;

  @IsString()
  @IsNotEmpty()
  batch: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  modules?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  subjects?: string[];

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  permanentAddress?: string;

  @IsString()
  @IsOptional()
  contactAddress?: string;

  @IsString()
  @IsOptional()
  administrativeDistrict?: string;

  @IsString()
  @IsOptional()
  postalCode?: string;

  @IsString()
  @IsOptional()
  dob?: string;

  @IsString()
  @IsOptional()
  dateOfBirth?: string;

  @IsString()
  @IsOptional()
  nicNo?: string;

  @IsString()
  @IsOptional()
  school?: string;

  @IsString()
  @IsOptional()
  avatar?: string;

  @IsString()
  @IsOptional()
  parentName?: string;

  @IsString()
  @IsOptional()
  parentPhone?: string;

  @IsString()
  @IsOptional()
  fatherName?: string;

  @IsString()
  @IsOptional()
  motherName?: string;

  @IsString()
  @IsOptional()
  guardianName?: string;

  @IsString()
  @IsOptional()
  guardianMobile?: string;

  @IsString()
  @IsOptional()
  fixedTelephone?: string;

  @IsString()
  @IsOptional()
  residingSince?: string;

  @IsString()
  @IsOptional()
  race?: string;

  @IsString()
  @IsOptional()
  religion?: string;

  @IsString()
  @IsOptional()
  citizenByDescent?: string;

  @IsString()
  @IsOptional()
  guardianAddress?: string;

  @IsString()
  @IsOptional()
  guardianFixedTel?: string;

  @IsString()
  @IsOptional()
  contactPerson?: string;

  @IsString()
  @IsOptional()
  olCategory?: string;

  @IsString()
  @IsOptional()
  olYear?: string;

  @IsString()
  @IsOptional()
  olIndexNumber?: string;

  @IsString()
  @IsOptional()
  olNameUsed?: string;

  @IsString()
  @IsOptional()
  olAccept?: string;

  @IsArray()
  @IsOptional()
  olResults?: any[];

  @IsString()
  @IsOptional()
  password?: string;
}