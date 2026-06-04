import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';

import { Student } from '../students/schemas/student.schema';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { AttendanceReportQueryDto } from './dto/report-query.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import {
  Attendance,
  AttendanceDocument,
} from './schemas/attendance.schema';

type AttendanceStatus = 'present' | 'absent';

type AttendanceReportItem = {
  id: string;
  studentId: string;
  moduleId: string;
  moduleName: string;
  date: string;
  status: AttendanceStatus;
  markedAt: string;
};

const ATTENDANCE_STATUSES = ['present', 'absent'] as const;