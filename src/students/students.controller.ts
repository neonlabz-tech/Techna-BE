import { Body, Controller, Param, Patch, Post } from '@nestjs/common';

import { CreateStudentDto } from './dto/create-student.dto';
import { RejectStudentDto } from './dto/reject-student.dto';
import { StudentsService } from './students.service';

@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post()
  registerStudent(@Body() createStudentDto: CreateStudentDto) {
    return this.studentsService.registerStudent(createStudentDto);
  }

  @Patch(':id/approve')
  approveStudent(@Param('id') id: string) {
    return this.studentsService.approveStudent(id);
  }

  @Patch(':id/reject')
  rejectStudent(
    @Param('id') id: string,
    @Body() rejectStudentDto: RejectStudentDto,
  ) {
    return this.studentsService.rejectStudent(id, rejectStudentDto);
  }

  @Post(':studentId/qr-code')
  generateStudentQrCode(@Param('studentId') studentId: string) {
    return this.studentsService.generateStudentQrCode(studentId);
  }
}
