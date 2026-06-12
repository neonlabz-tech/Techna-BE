import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Attendance } from '../attendance/schemas/attendance.schema';
import { Payment } from '../payments/schemas/payment.schema';
import { Student } from '../students/schemas/student.schema';
import { Teacher } from '../teachers/schemas/teacher.schema';
import { Module as CourseModule } from '../modules/schemas/module.schema';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(Student.name) private readonly studentModel: Model<Student>,
    @InjectModel(Teacher.name) private readonly teacherModel: Model<Teacher>,
    @InjectModel(CourseModule.name) private readonly moduleModel: Model<CourseModule>,
    @InjectModel(Attendance.name) private readonly attendanceModel: Model<Attendance>,
    @InjectModel(Payment.name) private readonly paymentModel: Model<Payment>,
  ) {}

  async getSummary() {
    try {
      const today = new Date().toISOString().split('T')[0];

      const [
        totalStudents,
        totalTeachers,
        totalModules,
        present,
        absent,
        pendingPayments,
        paidPayments,
      ] = await Promise.all([
        this.studentModel.countDocuments().exec(),
        this.teacherModel.countDocuments().exec(),
        this.moduleModel.countDocuments().exec(),
        this.attendanceModel.countDocuments({ date: today, status: 'present' }).exec(),
        this.attendanceModel.countDocuments({ date: today, status: 'absent' }).exec(),

        this.paymentModel.aggregate([
          {
            $match: {
              status: { $in: ['pending', 'overdue'] },
            },
          },
          {
            $group: {
              _id: null,
              count: { $sum: 1 },
              amount: { $sum: '$amount' },
            },
          },
        ]).exec(),

        this.paymentModel.aggregate([
          {
            $match: {
              status: { $regex: /^paid$/i },
            },
          },
          {
            $group: {
              _id: null,
              count: { $sum: 1 },
              amount: { $sum: '$amount' },
            },
          },
        ]).exec(),
      ]);

      const pending = pendingPayments[0] ?? { count: 0, amount: 0 };
      const paid = paidPayments[0] ?? { count: 0, amount: 0 };

      return {
        totalStudents,
        totalTeachers,
        totalModules,
        totalRevenue: paid.amount,
        paidRevenue: paid.amount,
        totalPaid: paid.amount,
        paidPayments: {
          count: paid.count,
          amount: paid.amount,
        },
        todayAttendance: {
          date: today,
          present,
          absent,
          total: present + absent,
        },
        pendingPayments: {
          count: pending.count,
          amount: pending.amount,
        },
      };
    } catch {
      throw new InternalServerErrorException('Failed to load dashboard summary');
    }
  }

  async getRevenue() {
    try {
      const result = await this.paymentModel.aggregate([
        {
          $match: {
            status: { $regex: /^paid$/i },
          },
        },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$amount' },
          },
        },
      ]).exec();

      return {
        totalRevenue: result[0]?.totalRevenue || 0,
      };
    } catch {
      throw new InternalServerErrorException('Failed to load revenue');
    }
  }
}