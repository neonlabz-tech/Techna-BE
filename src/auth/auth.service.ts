import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { Role } from '../enums/role.enum';
import { EmailService } from '../email/email.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    @InjectModel('Student') private studentModel: Model<any>,
    @InjectModel('Teacher') private teacherModel: Model<any>,
    private readonly emailService: EmailService,
  ) {}

  /**
   * Unified login for Admin, Teacher, and Student.
   * Admin credentials come from environment variables (not stored in DB).
   * For students, checks that the account is approved before issuing a token.
   */
  async login(email: string, password: string) {
    const normalizedEmail = email.toLowerCase().trim();

    // ── Admin check (env-based, no DB lookup needed) ──────────────────────
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

    // ── Database lookup — try Student first, then Teacher ─────────────────
    let user = await this.studentModel
      .findOne({ email: normalizedEmail })
      .lean();
    let role: Role = Role.STUDENT;

    if (!user) {
      user = await this.teacherModel
        .findOne({ email: normalizedEmail })
        .lean();
      role = Role.TEACHER;
    }

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // ── Password verification ─────────────────────────────────────────────
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // ── Status check for students (teachers have no status field) ─────────
    if (role === Role.STUDENT) {
      if (user.status === 'pending') {
        throw new UnauthorizedException(
          'Your registration is pending admin approval. You will be notified once approved.',
        );
      }
      if (user.status === 'rejected') {
        const reason = user.rejectionReason
          ? ` Reason: ${user.rejectionReason}`
          : '';
        throw new UnauthorizedException(
          `Your registration was rejected.${reason}`,
        );
      }
    }

    // ── Issue JWT ─────────────────────────────────────────────────────────
    const token = this.jwtService.sign({
      sub: user._id,
      email: user.email,
      role,
    });

    return { access_token: token, role };
  }

  private blacklistedTokens = new Set<string>();

  /**
   * Student-specific login endpoint.
   * Only looks up the Student collection and enforces the approval status check.
   */
  async studentLogin(email: string, password: string) {
    const normalizedEmail = email.toLowerCase().trim();

    const user = await this.studentModel
      .findOne({ email: normalizedEmail })
      .lean();

    if (!user) {
      // Intentionally vague — don't reveal whether the email exists
      throw new UnauthorizedException('Invalid student credentials');
    }

    // ── Password check ────────────────────────────────────────────────────
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid student credentials');
    }

    // ── FIXED: Status gate — block login for non-approved students ────────
    //
    // Previously missing — a PENDING or REJECTED student could log in and
    // receive a valid JWT. This is now corrected.
    if (user.status === 'pending') {
      throw new UnauthorizedException(
        'Your registration is pending admin approval. You will be notified once approved.',
      );
    }

    if (user.status === 'rejected') {
      const reason = user.rejectionReason
        ? ` Reason: ${user.rejectionReason}`
        : '';
      throw new UnauthorizedException(
        `Your registration was rejected.${reason}`,
      );
    }

    // ── Only APPROVED students reach this point ───────────────────────────
    const token = this.jwtService.sign({
      sub: user._id,
      email: user.email,
      role: Role.STUDENT,
    });

    return { access_token: token, role: Role.STUDENT };
  }

  async logout(token: string) {
    if (token) {
      this.blacklistedTokens.add(token);
    }
    return { message: 'Logged out successfully' };
  }

  isTokenBlacklisted(token: string): boolean {
    return this.blacklistedTokens.has(token);
  }

  async getSession(user: any) {
    if (user.role === Role.ADMIN) {
      return {
        userId: 'admin',
        email: user.email,
        role: Role.ADMIN,
      };
    } else if (user.role === Role.STUDENT) {
      const student = await this.studentModel
        .findById(user.userId)
        .select('-password')
        .lean();
      if (!student) {
        throw new UnauthorizedException('Student profile not found');
      }
      return { ...student, role: Role.STUDENT };
    } else if (user.role === Role.TEACHER) {
      const teacher = await this.teacherModel
        .findById(user.userId)
        .select('-password')
        .lean();
      if (!teacher) {
        throw new UnauthorizedException('Teacher profile not found');
      }
      return { ...teacher, role: Role.TEACHER };
    }
    throw new UnauthorizedException('Invalid user role');
  }

  async forgotPassword(email: string): Promise<void> {
    const student = await this.studentModel.findOne({ email: email.toLowerCase().trim() });

    // Always return success — do not reveal whether the email is registered
    if (!student) return;

    const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    student.resetToken = resetToken;
    student.resetTokenExpiry = resetTokenExpiry;
    await student.save();

    void this.emailService.sendPasswordResetEmail({
      email: student.email,
      name: student.fullNameEnglish ?? student.email,
      resetToken,
    });
  }

  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    const student = await this.studentModel.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: new Date() },
    });

    if (!student) {
      throw new BadRequestException('Invalid or expired reset code');
    }

    student.password = await bcrypt.hash(newPassword, 10);
    student.resetToken = undefined;
    student.resetTokenExpiry = undefined;
    await student.save();

    return { message: 'Password reset successfully' };
  }

  /**
   * Change password for an authenticated student.
   * Requires the current password to be correct before setting the new one.
   */
  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<{ message: string }> {
    const student = await this.studentModel.findById(userId);

    if (!student) {
      throw new UnauthorizedException('Student not found');
    }

    // Verify the current password
    const isMatch = await bcrypt.compare(currentPassword, student.password);
    if (!isMatch) {
      throw new BadRequestException('Current password is incorrect');
    }

    // Prevent setting the same password
    const isSame = await bcrypt.compare(newPassword, student.password);
    if (isSame) {
      throw new BadRequestException(
        'New password must be different from the current password',
      );
    }

    // Hash and save the new password
    student.password = await bcrypt.hash(newPassword, 10);
    await student.save();

    return { message: 'Password changed successfully' };
  }

  async hashPassword(plain: string): Promise<string> {
    return bcrypt.hash(plain, 10);
  }
}
