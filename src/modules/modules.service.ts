import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Module as SchoolModule } from './schemas/module.schema';

@Injectable()
export class ModulesService {
  constructor(
    @InjectModel(SchoolModule.name) private moduleModel: Model<any>,
  ) {}

  async findAll() {
    return this.moduleModel.find().lean();
  }

  async findOne(id: string) {
    const mod = await this.moduleModel.findById(id).lean();
    if (!mod) throw new NotFoundException('Module not found');
    return mod;
  }

  async create(data: any) {
    return this.moduleModel.create(data);
  }

  async update(id: string, data: any) {
    const mod = await this.moduleModel
      .findByIdAndUpdate(id, data, { new: true, runValidators: true })
      .lean();
    if (!mod) throw new NotFoundException('Module not found');
    return mod;
  }

  async remove(id: string) {
    const mod = await this.moduleModel.findByIdAndDelete(id).lean();
    if (!mod) throw new NotFoundException('Module not found');
    return { message: 'Module deleted successfully' };
  }
}
