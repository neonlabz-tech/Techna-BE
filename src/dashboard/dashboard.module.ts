import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
  Attendance,
  AttendanceSchema,
} from '../attendance/schemas/attendance.schema';
import { Payment, PaymentSchema } from '../payments/schemas/payment.schema';
import { Student, StudentSchema } from '../students/schemas/student.schema';
import { Teacher, TeacherSchema } from '../teachers/schemas/teacher.schema';
import {
  Module as CourseModule,
  ModuleSchema,
} from '../modules/schemas/module.schema';

import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Student.name, schema: StudentSchema },
      { name: Teacher.name, schema: TeacherSchema },
      { name: CourseModule.name, schema: ModuleSchema },
      { name: Attendance.name, schema: AttendanceSchema },
      { name: Payment.name, schema: PaymentSchema },
    ]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}