import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AttendanceModule } from './attendance/attendance.module';
import { validateEnvironment } from './config/env.validation';
import { ModulesModule } from './modules/modules.module';
import { PaymentsModule } from './payments/payments.module';
import { StorageModule } from './storage/storage.module';
import { StudentsModule } from './students/students.module';
import { TeacherModule } from './teachers/teacher.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('MONGODB_URI') || config.get<string>('MONGO_URI'),
      }),
    }),

    StudentsModule,
    TeacherModule,
    ModulesModule,
    AttendanceModule,
    PaymentsModule,
    StorageModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}