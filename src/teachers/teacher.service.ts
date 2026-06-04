import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Teacher, TeacherDocument } from './schemas/teacher.schema';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';

@Injectable()
export class TeacherService {
  constructor(
    @InjectModel(Teacher.name)
    private teacherModel: Model<TeacherDocument>,
  ) {}

  async create(createTeacherDto: CreateTeacherDto) {
    return this.teacherModel.create(createTeacherDto);
  }

  async findAll() {
    return this.teacherModel.find();
  }

  async findOne(id: string) {
    return this.teacherModel.findById(id);
  }

  async update(id: string, updateTeacherDto: UpdateTeacherDto) {
    return this.teacherModel.findByIdAndUpdate(id, updateTeacherDto, {
      new: true,
    });
  }

  async remove(id: string) {
    return this.teacherModel.findByIdAndDelete(id);
  }
}