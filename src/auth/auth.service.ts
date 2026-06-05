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
    // Inject Mongoose models for Student and Teacher collections
    @InjectModel('Student') private studentModel: Model<any>,
    @InjectModel('Teacher') private teacherModel: Model<any>,
  ) {}

  /**
   * Authenticates a user by email and password.
   * Checks admin credentials first (env-based), then looks up
   * the user in the Student and Teacher collections respectively.
   * Returns a signed JWT and the resolved role on success.
   */
  async login(email: string, password: string) {
    // Normalize email to avoid case/whitespace mismatches
    const normalizedEmail = email.toLowerCase().trim();

    // ── Admin check ──────────────────────────────────────────────────────────
    // Admin is not stored in the database; credentials come from environment
    // variables so there is no hash comparison — plain-text equality only.
    const adminEmail = this.configService.get<string>('ADMIN_EMAIL');
    const adminPassword = this.configService.get<string>('ADMIN_PASSWORD');

    if (normalizedEmail === adminEmail && password === adminPassword) {
      // Issue a JWT with the ADMIN role and return immediately
      const token = this.jwtService.sign({
        sub: 'admin',
        email: normalizedEmail,
        role: Role.ADMIN,
      });
      return { access_token: token, role: Role.ADMIN };
    }

    // ── Database lookup ───────────────────────────────────────────────────────
    // Try students first; fall back to teachers if not found.
    // `.lean()` returns a plain JS object instead of a Mongoose document
    // for better performance since we only need to read fields here.
    let user = await this.studentModel.findOne({ email: normalizedEmail }).lean();
    let role: Role = Role.STUDENT;

    if (!user) {
      // Not a student — check the teachers collection
      user = await this.teacherModel.findOne({ email: normalizedEmail }).lean();
      role = Role.TEACHER;
    }

    // No matching user found in either collection
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // ── Password verification ─────────────────────────────────────────────────
    // Compare the submitted plain-text password against the bcrypt hash
    // stored in the database. bcrypt.compare is timing-safe.
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // ── JWT signing ───────────────────────────────────────────────────────────
    // Embed the user's MongoDB _id, email, and resolved role in the token
    // payload so downstream guards and decorators can identify the caller.
    const token = this.jwtService.sign({
      sub: user._id,
      email: user.email,
      role,
    });

    return { access_token: token, role };
  }

  private blacklistedTokens = new Set<string>();

  async studentLogin(email: string, password: string) {
    const normalizedEmail = email.toLowerCase().trim();
    const user = await this.studentModel.findOne({ email: normalizedEmail }).lean();
    if (!user) {
      throw new UnauthorizedException('Invalid student credentials');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid student credentials');
    }
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
      const student = await this.studentModel.findById(user.userId).select('-password').lean();
      if (!student) {
        throw new UnauthorizedException('Student profile not found');
      }
      return {
        ...student,
        role: Role.STUDENT,
      };
    } else if (user.role === Role.TEACHER) {
      const teacher = await this.teacherModel.findById(user.userId).select('-password').lean();
      if (!teacher) {
        throw new UnauthorizedException('Teacher profile not found');
      }
      return {
        ...teacher,
        role: Role.TEACHER,
      };
    }
    throw new UnauthorizedException('Invalid user role');
  }

  /**
   * Hashes a plain-text password using bcrypt with a cost factor of 10.
   * Used by registration and password-reset flows.
   */
  async hashPassword(plain: string): Promise<string> {
    return bcrypt.hash(plain, 10);
  }
}