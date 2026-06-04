import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Module, SchoolModuleDocument } from './schemas/module.schema';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import {
  NotFoundException,
  InternalServerErrorException,
} from '../common/exceptions';

@Injectable()
export class ModulesService {
  constructor(
    @InjectModel(Module.name)
    private readonly moduleModel: Model<SchoolModuleDocument>,
  ) {}

  async create(createModuleDto: CreateModuleDto) {
    try {
      const newModule = new this.moduleModel(createModuleDto);
      return await newModule.save();
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to create module: ' + (error instanceof Error ? error.message : 'Unknown error'),
      );
    }
  }

  async findAll() {
    try {
      return await this.moduleModel.find().sort({ createdAt: -1 });
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to fetch modules: ' + (error instanceof Error ? error.message : 'Unknown error'),
      );
    }
  }

  async findOne(id: string) {
    try {
      const module = await this.moduleModel.findById(id);

      if (!module) {
        throw new NotFoundException('Module not found');
      }

      return module;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to fetch module: ' + (error instanceof Error ? error.message : 'Unknown error'),
      );
    }
  }

  async update(id: string, updateModuleDto: UpdateModuleDto) {
    try {
      const updatedModule = await this.moduleModel.findByIdAndUpdate(
        id,
        updateModuleDto,
        { new: true, runValidators: true },
      );

      if (!updatedModule) {
        throw new NotFoundException('Module not found');
      }

      return updatedModule;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to update module: ' + (error instanceof Error ? error.message : 'Unknown error'),
      );
    }
  }

  async remove(id: string) {
    try {
      const deletedModule = await this.moduleModel.findByIdAndDelete(id);

      if (!deletedModule) {
        throw new NotFoundException('Module not found');
      }

      return deletedModule;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to delete module: ' + (error instanceof Error ? error.message : 'Unknown error'),
      );
    }
  }
}