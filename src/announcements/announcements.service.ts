import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  Announcement,
  AnnouncementDocument,
} from './schemas/announcement.schema';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';

@Injectable()
export class AnnouncementsService {
  constructor(
    @InjectModel(Announcement.name)
    private readonly announcementModel: Model<AnnouncementDocument>,
  ) {}

  async create(dto: CreateAnnouncementDto) {
    return this.announcementModel.create({
      ...dto,
      audience: 'All Students',
      batch: dto.batch?.trim() || 'None',
      author: dto.author || 'Super Admin',
    });
  }

  async findAll() {
    return this.announcementModel.find().sort({ createdAt: -1 });
  }

  async update(id: string, dto: UpdateAnnouncementDto) {
    const updated = await this.announcementModel.findByIdAndUpdate(
      id,
      {
        ...dto,
        audience: 'All Students',
        batch: dto.batch?.trim() || 'None',
        author: dto.author || 'Super Admin',
      },
      { new: true },
    );

    if (!updated) throw new NotFoundException('Announcement not found');
    return updated;
  }

  async remove(id: string) {
    const deleted = await this.announcementModel.findByIdAndDelete(id);

    if (!deleted) throw new NotFoundException('Announcement not found');
    return { message: 'Announcement deleted successfully' };
  }
}
