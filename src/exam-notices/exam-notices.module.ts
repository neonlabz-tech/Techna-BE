import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ExamNoticesController } from './exam-notices.controller';
import { ExamNoticesService } from './exam-notices.service';
import {
  ExamNotice,
  ExamNoticeSchema,
} from './schemas/exam-notice.schema';
import { Student, StudentSchema } from '../students/schemas/student.schema';
import { Result, ResultSchema } from '../results/schemas/result.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ExamNotice.name, schema: ExamNoticeSchema },
      { name: Student.name, schema: StudentSchema },
      { name: Result.name, schema: ResultSchema },
    ]),
  ],
  controllers: [ExamNoticesController],
  providers: [ExamNoticesService],
  exports: [ExamNoticesService],
})
export class ExamNoticesModule {}