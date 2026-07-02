import { Model } from 'mongoose';
import { Attendance } from '../attendance/schemas/attendance.schema';
import { Payment } from '../payments/schemas/payment.schema';
import { Student } from '../students/schemas/student.schema';
import { Teacher } from '../teachers/schemas/teacher.schema';
import { Module as CourseModule } from '../modules/schemas/module.schema';
export declare class DashboardService {
    private readonly studentModel;
    private readonly teacherModel;
    private readonly moduleModel;
    private readonly attendanceModel;
    private readonly paymentModel;
    constructor(studentModel: Model<Student>, teacherModel: Model<Teacher>, moduleModel: Model<CourseModule>, attendanceModel: Model<Attendance>, paymentModel: Model<Payment>);
    getSummary(): Promise<{
        totalStudents: number;
        totalTeachers: number;
        totalModules: number;
        totalRevenue: any;
        paidRevenue: any;
        totalPaid: any;
        paidPayments: {
            count: any;
            amount: any;
        };
        todayAttendance: {
            date: string;
            present: number;
            absent: number;
            total: number;
        };
        pendingPayments: {
            count: any;
            amount: any;
        };
    }>;
    getRevenue(): Promise<{
        totalRevenue: any;
    }>;
}
