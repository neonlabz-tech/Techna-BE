import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AttendanceModule } from './attendance/attendance.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { validateEnvironment } from './config/env.validation';

import { ExamNoticesModule } from './exam-notices/exam-notices.module';
import { ModulesModule } from './modules/modules.module';
import { PaymentsModule } from './payments/payments.module';
import { StorageModule } from './storage/storage.module';
import { StudentsModule } from './students/students.module';
import { TeachersModule } from './teachers/teachers.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    // Config setup (safe + validated)
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validate: validateEnvironment,
    }),

    // MongoDB async config (best practice)
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri:
          config.get<string>('MONGODB_URI') ||
          config.get<string>('MONGO_URI'),
      }),
    }),

    // Feature modules
    StudentsModule,
    TeachersModule,
    ExamNoticesModule,
    ModulesModule,
    AttendanceModule,
    DashboardModule,
    PaymentsModule,
    AuthModule,
    StorageModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}