export class CreateStudentDto {
  name: string;
  email: string;
  phone: string;
  address: string;
  dob: string;
  batch: string;
  modules?: string[];
  avatar?: string;
  parentName?: string;
  parentPhone?: string;
}
