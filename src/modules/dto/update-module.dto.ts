export class UpdateModuleDto {
  name?: string;
  teacherId?: string;
  teacherName?: string;
  description?: string;
  duration?: string;
  fee?: number;
  batch?: string;
  status?: 'active' | 'inactive';
}