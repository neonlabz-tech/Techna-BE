import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Payment } from './schemas/payment.schema';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectModel(Payment.name) private paymentModel: Model<any>,
  ) {}

  async findAll() {
    return this.paymentModel.find().lean();
  }

  async findByStudent(studentId: string) {
    return this.paymentModel.find({ studentId }).lean();
  }

  async create(data: any) {
    return this.paymentModel.create(data);
  }
}
