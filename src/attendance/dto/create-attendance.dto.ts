export class CreateAttendanceDto {
  readonly studentId!: string;
  readonly moduleId!: string;
  readonly moduleName!: string;
  readonly date!: string;
  readonly status!: 'present' | 'absent';
  readonly markedAt!: string;
}
