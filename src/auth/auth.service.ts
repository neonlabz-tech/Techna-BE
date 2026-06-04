import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { Role } from '../enums/role.enum';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    @InjectModel('Student') private studentModel: Model<any>,
    @InjectModel('Teacher') private teacherModel: Model<any>,
  ) {}

  async login(email: string, password: string) {
    const normalizedEmail = email.toLowerCase().trim();

    // 1. Check admin credentials first (plain-text env compare — admin not stored in DB)
    const adminEmail = this.configService.get<string>('ADMIN_EMAIL');
    const adminPassword = this.configService.get<string>('ADMIN_PASSWORD');

    if (normalizedEmail === adminEmail && password === adminPassword) {
      const token = this.jwtService.sign({
        sub: 'admin',
        email: normalizedEmail,
        role: Role.ADMIN,
      });
      return { access_token: token, role: Role.ADMIN };
    }

    // 2. Try to find user in students
    let user = await this.studentModel.findOne({ email: normalizedEmail }).lean();
    let role: Role = Role.STUDENT;

    // 3. If not found in students, try teachers
    if (!user) {
      user = await this.teacherModel.findOne({ email: normalizedEmail }).lean();
      role = Role.TEACHER;
    }

    // 4. Still not found — invalid credentials
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 5. Verify hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 6. Sign JWT with role payload
    const token = this.jwtService.sign({
      sub: user._id,
      email: user.email,
      role,
    });

    return { access_token: token, role };
  }

  /**
   * Helper used by seeds / registration endpoints to hash passwords.
   */
  async hashPassword(plain: string): Promise<string> {
    return bcrypt.hash(plain, 10);
  }

  /**
   * DEV ONLY — seeds one test student and one test teacher.
   * Call POST /auth/seed once then remove or guard it in production.
   */
  async seed() {
    const hashedPassword = await bcrypt.hash('Test@1234', 10);

    const studentExists = await this.studentModel.findOne({ email: 'student@techna.com' });
    if (!studentExists) {
      await this.studentModel.create({
        studentId: 'STU001',
        qrToken: 'QR-STU001-TOKEN',
        name: 'Test Student',
        email: 'student@techna.com',
        password: hashedPassword,
        phone: '0700000001',
        address: '123 Main St',
        dob: '2000-01-01',
        batch: 'Batch-2024',
        modules: [],
        status: 'approved',
        enrolledAt: new Date().toISOString(),
      });
    }

    const teacherExists = await this.teacherModel.findOne({ email: 'teacher@techna.com' });
    if (!teacherExists) {
      await this.teacherModel.create({
        name: 'Test Teacher',
        email: 'teacher@techna.com',
        password: hashedPassword,
        phone: '0700000002',
        subject: 'Mathematics',
        qualification: 'B.Sc Mathematics',
        experience: '5 years',
        address: '456 School Rd',
        joinDate: new Date().toISOString(),
        status: 'active',
      });
    }

    return {
      message: 'Seed complete',
      credentials: {
        student: { email: 'student@techna.com', password: 'Test@1234' },
        teacher: { email: 'teacher@techna.com', password: 'Test@1234' },
        admin: { email: 'admin@techna.com (from .env)', password: 'Admin@1234 (from .env)' },
      },
    };
  }
}