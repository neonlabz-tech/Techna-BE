import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
<<<<<<< HEAD
import { Module as SchoolModule } from './schemas/module.schema';
=======

import { Module, SchoolModuleDocument } from './schemas/module.schema';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
>>>>>>> 4865900d3a2737a902004f0d5bf511c165efc7ee

@Injectable()
export class ModulesService {
  constructor(
<<<<<<< HEAD
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
=======
    @InjectModel(Module.name)
    private readonly moduleModel: Model<SchoolModuleDocument>,
  ) {}

  async create(createModuleDto: CreateModuleDto) {
    const newModule = new this.moduleModel(createModuleDto);
    return newModule.save();
  }

  async findAll() {
    return this.moduleModel.find().sort({ createdAt: -1 });
  }

  async findOne(id: string) {
    const module = await this.moduleModel.findById(id);

    if (!module) {
      throw new NotFoundException('Module not found');
    }

    return module;
  }

  async update(id: string, updateModuleDto: UpdateModuleDto) {
    const updatedModule = await this.moduleModel.findByIdAndUpdate(
      id,
      updateModuleDto,
      { new: true },
    );

    if (!updatedModule) {
      throw new NotFoundException('Module not found');
    }

    return updatedModule;
  }

  async remove(id: string) {
    const deletedModule = await this.moduleModel.findByIdAndDelete(id);

    if (!deletedModule) {
      throw new NotFoundException('Module not found');
    }

    return {
      message: 'Module deleted successfully',
    };
  }
}
>>>>>>> 4865900d3a2737a902004f0d5bf511c165efc7ee
