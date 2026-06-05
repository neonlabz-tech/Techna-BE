import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Attendance } from '../attendance/schemas/attendance.schema';
import { Payment } from '../payments/schemas/payment.schema';
import { Student } from '../students/schemas/student.schema';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(Student.name) private readonly studentModel: Model<Student>,
    @InjectModel(Attendance.name)
    private readonly attendanceModel: Model<Attendance>,
    @InjectModel(Payment.name) private readonly paymentModel: Model<Payment>,
  ) {}

  async getSummary() {
    try {
      const today = new Date().toISOString().split('T')[0];

      const [totalStudents, present, absent, pendingPayments] =
        await Promise.all([
          this.studentModel.countDocuments().exec(),
          this.attendanceModel
            .countDocuments({ date: today, status: 'present' })
            .exec(),
          this.attendanceModel
            .countDocuments({ date: today, status: 'absent' })
            .exec(),
          this.paymentModel
            .aggregate([
              { $match: { status: { $in: ['pending', 'overdue'] } } },
              {
                $group: {
                  _id: null,
                  count: { $sum: 1 },
                  amount: { $sum: '$amount' },
                },
              },
            ])
            .exec(),
        ]);

      const pending = pendingPayments[0] ?? { count: 0, amount: 0 };

      return {
        totalStudents,
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
      throw new InternalServerErrorException(
        'Failed to load dashboard summary',
      );
    }
  }
}
