import { Controller, Param, Patch, Post } from '@nestjs/common';
import { StudentsService } from './students.service';

@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Patch(':id/approve')
  approveStudent(@Param('id') id: string) {
    return this.studentsService.approveStudent(id);
  }

  @Post(':studentId/qr-code')
  generateStudentQrCode(@Param('studentId') studentId: string) {
    return this.studentsService.generateStudentQrCode(studentId);
  }
}
