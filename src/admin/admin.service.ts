import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin, AdminDocument } from './schemas/admin.schema';

@Injectable()
export class AdminService implements OnApplicationBootstrap {
  private readonly logger = new Logger(AdminService.name);

  constructor(
    @InjectModel(Admin.name) private adminModel: Model<AdminDocument>,
  ) {}

  async onApplicationBootstrap() {
    const adminCount = await this.adminModel.countDocuments();

    if (adminCount === 0) {
      this.logger.warn(
        'No admin found in database! Please manually insert an admin ' +
          'document into the "admin" collection via MongoDB Compass.',
      );
    } else {
      this.logger.log(`Admin ready ✅ (${adminCount} admin(s) in DB)`);
    }
  }
}
