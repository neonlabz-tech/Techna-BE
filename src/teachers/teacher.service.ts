import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Teacher, TeacherDocument } from './schemas/teacher.schema';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import {
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '../common/exceptions';

@Injectable()
export class TeacherService {
  constructor(
    @InjectModel(Teacher.name)
    private teacherModel: Model<TeacherDocument>,
  ) {}

  async create(createTeacherDto: CreateTeacherDto) {
    try {
      // Check if teacher with email already exists
      const existingTeacher = await this.teacherModel.findOne({
        email: createTeacherDto.email,
      });
      if (existingTeacher) {
        throw new ConflictException(
          `Teacher with email ${createTeacherDto.email} already exists`,
        );
      }

      const teacher = await this.teacherModel.create(createTeacherDto);
      return teacher;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to create teacher: ' + (error instanceof Error ? error.message : 'Unknown error'),
      );
    }
  }

  async findAll() {
    try {
      return await this.teacherModel.find();
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to fetch teachers: ' + (error instanceof Error ? error.message : 'Unknown error'),
      );
    }
  }

  async findOne(id: string) {
    try {
      const teacher = await this.teacherModel.findById(id);
      if (!teacher) {
        throw new NotFoundException(`Teacher with ID ${id} not found`);
      }
      return teacher;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to fetch teacher: ' + (error instanceof Error ? error.message : 'Unknown error'),
      );
    }
  }

  async update(id: string, updateTeacherDto: UpdateTeacherDto) {
    try {
      const teacher = await this.teacherModel.findByIdAndUpdate(
        id,
        updateTeacherDto,
        { new: true, runValidators: true },
      );

      if (!teacher) {
        throw new NotFoundException(`Teacher with ID ${id} not found`);
      }

      return teacher;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to update teacher: ' + (error instanceof Error ? error.message : 'Unknown error'),
      );
    }
  }

  async remove(id: string) {
    try {
      const teacher = await this.teacherModel.findByIdAndDelete(id);

      if (!teacher) {
        throw new NotFoundException(`Teacher with ID ${id} not found`);
      }

      return teacher;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to delete teacher: ' + (error instanceof Error ? error.message : 'Unknown error'),
      );
    }
  }
}