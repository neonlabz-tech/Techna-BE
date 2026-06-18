import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';      // ← removed APP_GUARD import
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
import { ContactModule } from './contact/contact.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
// ← removed JwtAuthGuard and RolesGuard imports (no longer needed here)

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validate: validateEnvironment,
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri:
          config.get<string>('MONGODB_URI') || config.get<string>('MONGO_URI'),
      }),
    }),

    StudentsModule,
    TeachersModule,
    ExamNoticesModule,
    ModulesModule,
    AttendanceModule,
    DashboardModule,
    PaymentsModule,
    AuthModule,
    ContactModule,
    StorageModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_INTERCEPTOR, useClass: ResponseInterceptor },
    // ← REMOVED: { provide: APP_GUARD, useClass: JwtAuthGuard },
    // ← REMOVED: { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
