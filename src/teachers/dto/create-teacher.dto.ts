export class CreateTeacherDto {
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  qualification: string;
  experience: string;
  address: string;
  joinDate: string;
  status?: 'active' | 'inactive';
}
