import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Attendance, AttendanceSchema } from './schemas/attendance.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Attendance.name, schema: AttendanceSchema }])],
})
export class AttendanceModule {}