import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AttendanceController } from './attendance.controller';
import { AttendanceService } from './attendance.service';
import { Attendance, AttendanceSchema } from './schemas/attendance.schema';
import { AttendanceController } from './attendance.controller';
import { AttendanceService } from './attendance.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Attendance.name, schema: AttendanceSchema }])],
  controllers: [AttendanceController],
  providers: [AttendanceService],
<<<<<<< HEAD
  exports: [AttendanceService],
=======
>>>>>>> 823465b60ba6f481fefb3cb89d7b02c5622a61b8
})
export class AttendanceModule {}
