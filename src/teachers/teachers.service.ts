import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { Teacher } from './schemas/teacher.schema';
import { StorageService } from '../storage/storage.service';

@Injectable()
export class TeachersService {
  constructor(
    @InjectModel(Teacher.name) private teacherModel: Model<any>,
    private readonly storageService: StorageService,
  ) {}

  async findAll(status?: string) {
    const filter = status ? { status } : {};
    return this.teacherModel.find(filter).select('-password').lean();
  }

  async findOne(id: string) {
    const teacher = await this.teacherModel
      .findById(id)
      .select('-password')
      .lean();
    if (!teacher) throw new NotFoundException('Teacher not found');
    return teacher;
  }

  async create(data: any) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    const teacher = await this.teacherModel.create(data);
    const { password, ...result } = teacher.toObject();
    return result;
  }

  async update(id: string, data: any) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    const teacher = await this.teacherModel
      .findByIdAndUpdate(id, data, { new: true, runValidators: true })
      .select('-password')
      .lean();
    if (!teacher) throw new NotFoundException('Teacher not found');
    return teacher;
  }

  async remove(id: string) {
    const teacher = await this.teacherModel.findByIdAndDelete(id).lean();
    if (!teacher) throw new NotFoundException('Teacher not found');
    return { message: 'Teacher deleted successfully' };
  }

  async removePhoto(id: string) {
    const teacher = await this.teacherModel.findById(id);
    if (!teacher) throw new NotFoundException('Teacher not found');

    if (teacher.photoKey) {
      try {
        await this.storageService.deleteFile(teacher.photoKey);
      } catch (e) {
        console.error('[Teacher] Failed to delete photo from R2:', e);
      }
    }

    teacher.photoUrl = undefined;
    teacher.photoKey = undefined;
    await teacher.save();

    const { password, ...result } = teacher.toObject();
    return result;
  }

  async uploadPhoto(id: string, file: Express.Multer.File) {
    if (!file) throw new BadRequestException('No file provided');
    if (!file.buffer || file.buffer.length === 0) {
      throw new BadRequestException('File buffer is empty');
    }

    console.log('[Teacher] uploadPhoto called:', {
      id,
      filename: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
    });

    const teacher = await this.teacherModel.findById(id);
    if (!teacher) throw new NotFoundException('Teacher not found');

    if (teacher.photoKey) {
      try {
        await this.storageService.deleteFile(teacher.photoKey);
      } catch (e) {
        console.error('[Teacher] Failed to delete old photo:', e);
      }
    }

    const ext = file.originalname.split('.').pop()?.toLowerCase() || 'jpg';
    const key = `teachers/${id}-${Date.now()}.${ext}`;

    const photoUrl = await this.storageService.uploadFile(
      key,
      file.buffer,
      file.mimetype,
    );

    teacher.photoUrl = photoUrl;
    teacher.photoKey = key;
    await teacher.save();

    console.log('[Teacher] Photo saved:', photoUrl);

    const { password, ...result } = teacher.toObject();
    return result;
  }
}
