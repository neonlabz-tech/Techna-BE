import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ResultsController } from './results.controller';
import { ResultsService } from './results.service';
import { Result, ResultSchema } from './schemas/result.schema';
import { Student, StudentSchema } from '../students/schemas/student.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Result.name, schema: ResultSchema },
      { name: Student.name, schema: StudentSchema },
    ]),
  ],
  controllers: [ResultsController],
  providers: [ResultsService],
  exports: [ResultsService],
})
export class ResultsModule {}