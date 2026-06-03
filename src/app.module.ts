import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AttendanceModule } from './attendance/attendance.module';
import { ModulesModule } from './modules/modules.module';
import { PaymentsModule } from './payments/payments.module';
import { StudentsModule } from './students/students.module';
import { TeachersModule } from './teachers/teachers.module';

@Module({
  imports: [StudentsModule, TeachersModule, ModulesModule, AttendanceModule, PaymentsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}