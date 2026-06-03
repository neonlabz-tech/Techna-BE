import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Student, StudentSchema } from './schemas/student.schema';

@Module({
	imports: [MongooseModule.forFeature([{ name: Student.name, schema: StudentSchema }])],
})
export class StudentsModule {}
