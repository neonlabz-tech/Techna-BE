import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Payment } from './schemas/payment.schema';
import { Student } from '../students/schemas/student.schema';
import { Module as SchoolModule } from '../modules/schemas/module.schema';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentTrackingQueryDto } from './dto/payment-tracking-query.dto';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectModel(Payment.name) private paymentModel: Model<any>,
    @InjectModel(Student.name) private readonly studentModel: Model<any>,
    @InjectModel(SchoolModule.name) private readonly moduleModel: Model<any>,
  ) {}

  async findAll() {
    return this.paymentModel.find().sort({ paidDate: -1, createdAt: -1 }).lean();
  }

  async findByStudent(studentId: string) {
    return this.paymentModel
      .find({ studentId })
      .sort({ paidDate: -1, createdAt: -1 })
      .lean();
  }

  async create(data: CreatePaymentDto) {
    const student = await this.resolveStudent(data.studentId);
    const module = await this.resolveModule(data.moduleId);
    const paidMonth = this.getMonthKey(data.paidDate);

    await this.ensureNoDuplicateMonthlyPayment(data.studentId, data.moduleId, paidMonth);

    const receiptNo = data.receiptNo?.trim() || (await this.generateUniqueReceiptNo());
    await this.ensureReceiptNoUnique(receiptNo);

    const payment = await this.paymentModel.create({
      studentId: data.studentId,
      studentName: data.studentName?.trim() || student.name,
      moduleId: data.moduleId,
      moduleName: data.moduleName?.trim() || module.name,
      amount: data.amount,
      paidDate: this.normalizeDate(data.paidDate),
      method: data.method,
      status: data.status || 'paid',
      receiptNo,
      batch: data.batch,
    });

    return this.toPaymentRecord(payment);
  }

  async getStudentTracking(studentId: string, query: PaymentTrackingQueryDto) {
    const year = query.year ?? new Date().getFullYear();
    const range = this.resolveMonthRange(year, query.from, query.to);
    const payments = await this.queryPayments(studentId, query.moduleId, range);

    const paidMonths = Array.from(
      new Set(
        payments
          .filter((payment) => payment.status === 'paid')
          .map((payment) => this.getMonthKey(payment.paidDate)),
      ),
    ).sort();

    const pendingMonths = range.months.filter((month) => !paidMonths.includes(month));

    return {
      success: true,
      studentId,
      year,
      ...(query.moduleId ? { moduleId: query.moduleId } : {}),
      paidMonths,
      pendingMonths,
      payments,
    };
  }

  private async queryPayments(
    studentId: string,
    moduleId: string | undefined,
    range: { from: string; to: string; months: string[] },
  ) {
    const payments = await this.paymentModel
      .find({
        studentId,
        ...(moduleId ? { moduleId } : {}),
        paidDate: {
          $gte: `${range.from}-01`,
          $lte: `${range.to}-31`,
        },
      })
      .sort({ paidDate: -1, createdAt: -1 })
      .lean();

    return payments.map((payment) => this.toPaymentRecord(payment));
  }

  private async resolveStudent(studentId: string) {
    const student = await this.studentModel
      .findOne({
        $or: [{ _id: studentId }, { studentId }],
      })
      .lean();

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    return student;
  }

  private async resolveModule(moduleId: string) {
    const module = await this.moduleModel.findById(moduleId).lean();

    if (!module) {
      throw new NotFoundException('Module not found');
    }

    return module;
  }

  private async ensureNoDuplicateMonthlyPayment(studentId: string, moduleId: string, paidMonth: string) {
    const existing = await this.paymentModel.findOne({
      studentId,
      moduleId,
      paidDate: new RegExp(`^${paidMonth}-`),
    });

    if (existing) {
      throw new ConflictException('Payment already exists for this student, module, and month');
    }
  }

  private async ensureReceiptNoUnique(receiptNo: string) {
    const existing = await this.paymentModel.findOne({ receiptNo }).lean();

    if (existing) {
      throw new ConflictException('receiptNo already exists');
    }
  }

  private async generateUniqueReceiptNo() {
    for (let attempt = 0; attempt < 5; attempt += 1) {
      const receiptNo = `REC-${Date.now()}-${Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, '0')}`;
      const existing = await this.paymentModel.findOne({ receiptNo }).lean();

      if (!existing) {
        return receiptNo;
      }
    }

    throw new BadRequestException('Unable to generate unique receipt number');
  }

  private resolveMonthRange(year: number, from?: string, to?: string) {
    if (from && to) {
      return {
        from,
        to,
        months: this.buildMonthList(from, to),
      };
    }

    const start = `${year}-01`;
    const end = `${year}-12`;

    return {
      from: start,
      to: end,
      months: this.buildMonthList(start, end),
    };
  }

  private buildMonthList(from: string, to: string) {
    const start = this.parseMonth(from);
    const end = this.parseMonth(to);

    if (start.getTime() > end.getTime()) {
      throw new BadRequestException('from must be before or equal to to');
    }

    const months: string[] = [];
    const cursor = new Date(start.getFullYear(), start.getMonth(), 1);

    while (cursor <= end) {
      months.push(this.formatMonth(cursor));
      cursor.setMonth(cursor.getMonth() + 1);
    }

    return months;
  }

  private parseMonth(value: string) {
    if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(value)) {
      throw new BadRequestException('Month values must be in YYYY-MM format');
    }

    const [year, month] = value.split('-').map(Number);
    return new Date(year, month - 1, 1);
  }

  private getMonthKey(dateValue: string) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
      throw new BadRequestException('paidDate must be in YYYY-MM-DD format');
    }

    return dateValue.slice(0, 7);
  }

  private normalizeDate(dateValue: string) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
      throw new BadRequestException('paidDate must be in YYYY-MM-DD format');
    }

    return dateValue;
  }

  private formatMonth(date: Date) {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    return `${year}-${month}`;
  }

  private toPaymentRecord(payment: any) {
    return {
      id: payment._id?.toString?.() ?? payment._id,
      studentId: payment.studentId,
      studentName: payment.studentName,
      moduleId: payment.moduleId,
      moduleName: payment.moduleName,
      amount: payment.amount,
      paidDate: payment.paidDate,
      method: payment.method,
      status: payment.status,
      receiptNo: payment.receiptNo,
      batch: payment.batch,
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt,
    };
  }
}
