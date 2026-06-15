import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type StudentDocument = HydratedDocument<Student>;

// ── O/L grade enum ────────────────────────────────────────────────────────────
export enum OlGrade {
  A_PLUS  = 'A+',
  A       = 'A',
  A_MINUS = 'A-',
  B_PLUS  = 'B+',
  B       = 'B',
  B_MINUS = 'B-',
  C_PLUS  = 'C+',
  C       = 'C',
  C_MINUS = 'C-',
  S       = 'S',
  F       = 'F',
  AB      = 'AB', // Absent
}

// ── O/L result row — embedded subdocument ─────────────────────────────────────
@Schema({ _id: false })
export class OlResultRow {
  @Prop({ required: true })
  year!: string;

  @Prop({ required: true })
  indexNumber!: string;

  @Prop({ enum: Object.values(OlGrade), default: null })
  english?: string;

  @Prop({ enum: Object.values(OlGrade), default: null })
  mathematics?: string;

  @Prop({ enum: Object.values(OlGrade), default: null })
  science?: string;

  @Prop({ enum: Object.values(OlGrade), default: null })
  sinhala?: string;

  @Prop({ enum: Object.values(OlGrade), default: null })
  tamil?: string;

  
}

export const OlResultRowSchema = SchemaFactory.createForClass(OlResultRow);

// ── A/L subject enum ──────────────────────────────────────────────────────────
export enum AlSubject {
  ENGINEERING_TECHNOLOGY = 'Engineering Technology',
  BIO_SYSTEMS_TECHNOLOGY = 'Bio Systems Technology',
  SCIENCE_FOR_TECHNOLOGY = 'Science For Technology',
  ICT                    = 'Information Communication Technology',
  AGRICULTURAL_SCIENCE   = 'Agricultural Science',
  MATHEMATICS            = 'Mathematics',
  GEOGRAPHY              = 'Geography',
}

// ── District enum ─────────────────────────────────────────────────────────────
export enum District {
  COLOMBO       = 'Colombo',
  GAMPAHA       = 'Gampaha',
  KALUTARA      = 'Kalutara',
  KANDY         = 'Kandy',
  MATALE        = 'Matale',
  NUWARA_ELIYA  = 'Nuwara Eliya',
  GALLE         = 'Galle',
  MATARA        = 'Matara',
  HAMBANTOTA    = 'Hambantota',
  JAFFNA        = 'Jaffna',
  KILINOCHCHI   = 'Kilinochchi',
  MANNAR        = 'Mannar',
  MULLAITIVU    = 'Mullaitivu',
  VAVUNIYA      = 'Vavuniya',
  PUTTALAM      = 'Puttalam',
  KURUNEGALA    = 'Kurunegala',
  ANURADHAPURA  = 'Anuradhapura',
  POLONNARUWA   = 'Polonnaruwa',
  BADULLA       = 'Badulla',
  MONARAGALA    = 'Monaragala',
  RATNAPURA     = 'Ratnapura',
  KEGALLE       = 'Kegalle',
  AMPARA        = 'Ampara',
  BATTICALOA    = 'Batticaloa',
  TRINCOMALEE   = 'Trincomalee',
}

// ── Main Student schema ───────────────────────────────────────────────────────
@Schema({ timestamps: true })
export class Student {

  // ── EXISTING: System / identity fields ─────────────────────────────────────

  @Prop({ required: true, unique: true })
  studentId!: string; // e.g. STU001 (sequential counter)

  @Prop({ required: true, unique: true })
  qrToken!: string;

  @Prop()
  qrCode?: string;

    @Prop()
qrImageKey?: string;

@Prop()
qrCodeUrl?: string;



  // ── EXISTING: Core account fields ──────────────────────────────────────────

  @Prop({ required: true, lowercase: true, trim: true })
  email!: string;

  @Prop({ required: true })
  password!: string; // stored hashed

  @Prop({ required: true })
  phone!: string; // kept for backward compatibility (maps to whatsappNo)

  @Prop({ required: true })
  batch!: string;

  @Prop({ type: [String], default: [] })
  modules!: string[]; // kept for backward compatibility

  // ── EXISTING: Status & approval ────────────────────────────────────────────

  @Prop({
    required: true,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  })
  status!: 'pending' | 'approved' | 'rejected';

  @Prop()
  enrolledAt!: string;

  @Prop()
  approvedAt?: string;

  @Prop()
  rejectionReason?: string;

  // ── EXISTING: Optional profile basics ──────────────────────────────────────

  @Prop()
  avatar?: string;

  @Prop()
  parentName?: string;

  @Prop()
  parentPhone?: string;

  // ── EXISTING: Made optional (relaxed from required) ────────────────────────

  @Prop()
  address?: string;

  @Prop()
  dob?: string;

  // ══════════════════════════════════════════════════════════════════════════
  // NEW: Auto-generated admission references
  // ══════════════════════════════════════════════════════════════════════════

  @Prop({ unique: true, sparse: true })
  admissionNumber?: string; // e.g. ADM-2024-0001

  @Prop({ unique: true, sparse: true })
  serialNumber?: string; // e.g. SN-2024-0001

  @Prop({ unique: true, sparse: true })
  applicationReference?: string; // e.g. APP-2024-0001

  // ══════════════════════════════════════════════════════════════════════════
  // NEW: Section B — Full personal details
  // ══════════════════════════════════════════════════════════════════════════

  @Prop()
  fullNameTamil?: string;

  @Prop({ uppercase: true })
  fullNameEnglish?: string; // required when using the full admission form

  @Prop()
  dateOfBirth?: Date; // computed from dobDay/dobMonth/dobYear or sent directly

  @Prop({ unique: true, sparse: true })
  nicNo?: string;

  @Prop()
  school?: string;

  @Prop()
  whatsappNo?: string;

  @Prop()
  parentsNo?: string;

  @Prop()
  permanentAddress?: string;

  @Prop({ enum: Object.values(District) })
  administrativeDistrict?: string;

  @Prop()
  fixedTelephone?: string;

  @Prop()
  residingSince?: string;

  @Prop({
  enum: [
    'Sri Lankan Tamil',
    'Sri Lankan Moor',
    'Indian Tamil',
    'Sinhalese',
    'Burgher',
    'Malay',
    'Other',
  ],
})
race?: string;

  @Prop({ enum: ['Buddhism', 'Hinduism', 'Islam', 'Christianity(RC/Non.RC)', 'Other'] })
  religion?: string;

  @Prop({ enum: ['YES', 'NO'], default: 'YES' })
  citizenByDescent?: string;

  @Prop()
  contactAddress?: string;

  @Prop()
  postalCode?: string;

  // ══════════════════════════════════════════════════════════════════════════
  // NEW: Section C — Parent / Guardian details
  // ══════════════════════════════════════════════════════════════════════════

  @Prop({ uppercase: true })
  fatherName?: string;

  @Prop({ uppercase: true })
  motherName?: string;

  @Prop({ uppercase: true })
  guardianName?: string;

  @Prop({ enum: ['Father', 'Mother', 'Guardian'], default: 'Mother' })
  contactPerson?: string;

  @Prop()
  guardianAddress?: string;

  @Prop()
  guardianFixedTel?: string;

  @Prop()
  guardianMobile?: string;

  // ══════════════════════════════════════════════════════════════════════════
  // NEW: Section D — O/L academic records
  // ══════════════════════════════════════════════════════════════════════════

  @Prop({ enum: ['Local O/L', 'London O/L'], default: 'Local O/L' })
  olCategory?: string;

  @Prop()
  olYear?: string;

  @Prop()
  olIndexNumber?: string;

  @Prop({ uppercase: true })
  olNameUsed?: string;

  @Prop({ enum: ['Accept', 'Change'], default: 'Accept' })
  olAccept?: string;

  @Prop({ type: [OlResultRowSchema], default: [] })
  olResults?: OlResultRow[];

  // ══════════════════════════════════════════════════════════════════════════
  // NEW: Section E — A/L subject selection
  // ══════════════════════════════════════════════════════════════════════════

  @Prop({ type: [String], enum: Object.values(AlSubject) })
  subjects?: string[];

  @Prop()
  agreed?: boolean;
}

export const StudentSchema = SchemaFactory.createForClass(Student);
