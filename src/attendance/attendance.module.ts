import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AttendanceController } from './attendance.controller';
import { AttendanceService } from './attendance.service';

import { Attendance, AttendanceSchema } from './schemas/attendance.schema';
import { Student, StudentSchema } from '../students/schemas/student.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Attendance.name, schema: AttendanceSchema },
      { name: Student.name, schema: StudentSchema },
    ]),
  ],
  controllers: [AttendanceController],
  providers: [AttendanceService],
  exports: [AttendanceService],
})
export class AttendanceModule {}