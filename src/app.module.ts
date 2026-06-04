import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AttendanceModule } from './attendance/attendance.module';
import { ModulesModule } from './modules/modules.module';
import { PaymentsModule } from './payments/payments.module';
import { StudentsModule } from './students/students.module';
import { TeacherModule } from './teachers/teacher.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGODB_URI!),
    StudentsModule,
    TeacherModule,
    ModulesModule,
    AttendanceModule,
    PaymentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}