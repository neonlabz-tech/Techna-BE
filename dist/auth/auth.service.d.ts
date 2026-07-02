import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { Role } from '../enums/role.enum';
import { EmailService } from '../email/email.service';
export declare class AuthService {
    private jwtService;
    private configService;
    private studentModel;
    private teacherModel;
    private readonly emailService;
    constructor(jwtService: JwtService, configService: ConfigService, studentModel: Model<any>, teacherModel: Model<any>, emailService: EmailService);
    login(email: string, password: string): Promise<{
        access_token: string;
        role: Role;
    }>;
    private blacklistedTokens;
    studentLogin(email: string, password: string): Promise<{
        access_token: string;
        role: Role;
    }>;
    logout(token: string): Promise<{
        message: string;
    }>;
    isTokenBlacklisted(token: string): boolean;
    getSession(user: any): Promise<any>;
    forgotPassword(email: string): Promise<void>;
    resetPassword(token: string, newPassword: string): Promise<{
        message: string;
    }>;
    changePassword(userId: string, currentPassword: string, newPassword: string): Promise<{
        message: string;
    }>;
    hashPassword(plain: string): Promise<string>;
}
