import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AttendanceModule } from './attendance/attendance.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ModulesModule } from './modules/modules.module';
import { PaymentsModule } from './payments/payments.module';
import { StudentsModule } from './students/students.module';
import { TeachersModule } from './teachers/teachers.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri:
          config.get<string>('MONGODB_URI') ||
          config.get<string>('MONGO_URI'),
      }),
    }),

    StudentsModule,
    TeachersModule,
    ModulesModule,
    AttendanceModule,
    DashboardModule,
    PaymentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}