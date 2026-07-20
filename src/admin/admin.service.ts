import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { Admin, AdminDocument } from './schemas/admin.schema';

const SEED_ADMIN_EMAIL = 'technaadmin2026@gmail.com';
const SEED_ADMIN_PASSWORD = 'techna_admin_2026';

@Injectable()
export class AdminService implements OnApplicationBootstrap {
  private readonly logger = new Logger(AdminService.name);

  constructor(
    @InjectModel(Admin.name) private adminModel: Model<AdminDocument>,
  ) {}

  async onApplicationBootstrap() {
    await this.seedAdmin();
  }

  async seedAdmin() {
    const existing = await this.adminModel.findOne({
      email: SEED_ADMIN_EMAIL,
    });

    if (!existing) {
      const hashedPassword = await bcrypt.hash(SEED_ADMIN_PASSWORD, 10);
      await this.adminModel.create({
        email: SEED_ADMIN_EMAIL,
        password: hashedPassword,
        role: 'admin',
      });
      this.logger.log('Admin seeded ✅');
    }
  }
}
