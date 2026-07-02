"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const bcrypt = __importStar(require("bcryptjs"));
const role_enum_1 = require("../enums/role.enum");
const email_service_1 = require("../email/email.service");
let AuthService = class AuthService {
    constructor(jwtService, configService, studentModel, teacherModel, emailService) {
        this.jwtService = jwtService;
        this.configService = configService;
        this.studentModel = studentModel;
        this.teacherModel = teacherModel;
        this.emailService = emailService;
        this.blacklistedTokens = new Set();
    }
    async login(email, password) {
        const normalizedEmail = email.toLowerCase().trim();
        const adminEmail = this.configService.get('ADMIN_EMAIL');
        const adminPassword = this.configService.get('ADMIN_PASSWORD');
        if (normalizedEmail === adminEmail && password === adminPassword) {
            const token = this.jwtService.sign({
                sub: 'admin',
                email: normalizedEmail,
                role: role_enum_1.Role.ADMIN,
            });
            return { access_token: token, role: role_enum_1.Role.ADMIN };
        }
        let user = await this.studentModel
            .findOne({ email: normalizedEmail })
            .lean();
        let role = role_enum_1.Role.STUDENT;
        if (!user) {
            user = await this.teacherModel
                .findOne({ email: normalizedEmail })
                .lean();
            role = role_enum_1.Role.TEACHER;
        }
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (role === role_enum_1.Role.STUDENT) {
            if (user.status === 'pending') {
                throw new common_1.UnauthorizedException('Your registration is pending admin approval. You will be notified once approved.');
            }
            if (user.status === 'rejected') {
                const reason = user.rejectionReason
                    ? ` Reason: ${user.rejectionReason}`
                    : '';
                throw new common_1.UnauthorizedException(`Your registration was rejected.${reason}`);
            }
        }
        const token = this.jwtService.sign({
            sub: user._id,
            email: user.email,
            role,
        });
        return { access_token: token, role };
    }
    async studentLogin(email, password) {
        const normalizedEmail = email.toLowerCase().trim();
        const user = await this.studentModel
            .findOne({ email: normalizedEmail })
            .lean();
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid student credentials');
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new common_1.UnauthorizedException('Invalid student credentials');
        }
        if (user.status === 'pending') {
            throw new common_1.UnauthorizedException('Your registration is pending admin approval. You will be notified once approved.');
        }
        if (user.status === 'rejected') {
            const reason = user.rejectionReason
                ? ` Reason: ${user.rejectionReason}`
                : '';
            throw new common_1.UnauthorizedException(`Your registration was rejected.${reason}`);
        }
        const token = this.jwtService.sign({
            sub: user._id,
            email: user.email,
            role: role_enum_1.Role.STUDENT,
        });
        return { access_token: token, role: role_enum_1.Role.STUDENT };
    }
    async logout(token) {
        if (token) {
            this.blacklistedTokens.add(token);
        }
        return { message: 'Logged out successfully' };
    }
    isTokenBlacklisted(token) {
        return this.blacklistedTokens.has(token);
    }
    async getSession(user) {
        if (user.role === role_enum_1.Role.ADMIN) {
            return {
                userId: 'admin',
                email: user.email,
                role: role_enum_1.Role.ADMIN,
            };
        }
        else if (user.role === role_enum_1.Role.STUDENT) {
            const student = await this.studentModel
                .findById(user.userId)
                .select('-password')
                .lean();
            if (!student) {
                throw new common_1.UnauthorizedException('Student profile not found');
            }
            return { ...student, role: role_enum_1.Role.STUDENT };
        }
        else if (user.role === role_enum_1.Role.TEACHER) {
            const teacher = await this.teacherModel
                .findById(user.userId)
                .select('-password')
                .lean();
            if (!teacher) {
                throw new common_1.UnauthorizedException('Teacher profile not found');
            }
            return { ...teacher, role: role_enum_1.Role.TEACHER };
        }
        throw new common_1.UnauthorizedException('Invalid user role');
    }
    async forgotPassword(email) {
        const student = await this.studentModel.findOne({ email: email.toLowerCase().trim() });
        if (!student)
            return;
        const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
        const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000);
        student.resetToken = resetToken;
        student.resetTokenExpiry = resetTokenExpiry;
        await student.save();
        void this.emailService.sendPasswordResetEmail({
            email: student.email,
            name: student.fullNameEnglish ?? student.email,
            resetToken,
        });
    }
    async resetPassword(token, newPassword) {
        const student = await this.studentModel.findOne({
            resetToken: token,
            resetTokenExpiry: { $gt: new Date() },
        });
        if (!student) {
            throw new common_1.BadRequestException('Invalid or expired reset code');
        }
        student.password = await bcrypt.hash(newPassword, 10);
        student.resetToken = undefined;
        student.resetTokenExpiry = undefined;
        await student.save();
        return { message: 'Password reset successfully' };
    }
    async changePassword(userId, currentPassword, newPassword) {
        const student = await this.studentModel.findById(userId);
        if (!student) {
            throw new common_1.UnauthorizedException('Student not found');
        }
        const isMatch = await bcrypt.compare(currentPassword, student.password);
        if (!isMatch) {
            throw new common_1.BadRequestException('Current password is incorrect');
        }
        const isSame = await bcrypt.compare(newPassword, student.password);
        if (isSame) {
            throw new common_1.BadRequestException('New password must be different from the current password');
        }
        student.password = await bcrypt.hash(newPassword, 10);
        await student.save();
        return { message: 'Password changed successfully' };
    }
    async hashPassword(plain) {
        return bcrypt.hash(plain, 10);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, mongoose_1.InjectModel)('Student')),
    __param(3, (0, mongoose_1.InjectModel)('Teacher')),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        config_1.ConfigService,
        mongoose_2.Model,
        mongoose_2.Model,
        email_service_1.EmailService])
], AuthService);
//# sourceMappingURL=auth.service.js.map