import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Module, SchoolModuleDocument } from './schemas/module.schema';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';

@Injectable()
export class ModulesService {
  constructor(
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