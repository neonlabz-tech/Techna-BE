import { Injectable, Logger, OnApplicationBootstrap, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
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

  async registerAdmin(email: string, password: string): Promise<{ message: string }> {
    const normalizedEmail = email.toLowerCase().trim();

    // Check if admin already exists
    const existingAdmin = await this.adminModel.findOne({ email: normalizedEmail });
    if (existingAdmin) {
      throw new ConflictException('Admin with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin
    const admin = new this.adminModel({
      email: normalizedEmail,
      password: hashedPassword,
      role: 'admin',
      isActive: true,
    });

    await admin.save();
    this.logger.log(`New admin registered: ${normalizedEmail}`);

    return { message: 'Admin registered successfully' };
  }
}
