import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { EmailModule } from '../email/email.module';

import { Counter, CounterSchema } from './schemas/counter.schema';
import { Student, StudentSchema } from './schemas/student.schema';
import { StudentsController } from './students.controller';
import { StudentsService } from './students.service';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [
    EmailModule,
    MongooseModule.forFeature([
      { name: Student.name, schema: StudentSchema },
      { name: Counter.name, schema: CounterSchema },
      
    ]),
    StorageModule,
  ],
  controllers: [StudentsController],
  providers: [StudentsService],
  exports: [StudentsService],
})
export class StudentsModule {}