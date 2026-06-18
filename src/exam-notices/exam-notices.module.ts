import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ExamNoticesController } from './exam-notices.controller';
import { ExamNoticesService } from './exam-notices.service';
import {
  ExamNotice,
  ExamNoticeSchema,
} from './schemas/exam-notice.schema';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ExamNotice.name, schema: ExamNoticeSchema },
    ]),
    NotificationsModule,
  ],
  controllers: [ExamNoticesController],
  providers: [ExamNoticesService],
  exports: [ExamNoticesService],
})
export class ExamNoticesModule {}