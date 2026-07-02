import { AuthService } from './auth.service';
import { Role } from '../enums/role.enum';
import { ChangePasswordDto } from './dto/change-password.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(body: {
        email: string;
        password: string;
    }): Promise<{
        access_token: string;
        role: Role;
    }>;
    studentLogin(body: {
        email: string;
        password: string;
    }): Promise<{
        access_token: string;
        role: Role;
    }>;
    logout(authHeader: string): Promise<{
        message: string;
    }>;
    getSession(req: any): Promise<any>;
    getProfile(req: any): {
        message: string;
        user: any;
    };
    adminOnly(): {
        message: string;
    };
    teacherOnly(): {
        message: string;
    };
    studentOnly(): {
        message: string;
    };
    changePassword(req: any, body: ChangePasswordDto): Promise<{
        message: string;
    }>;
    forgotPassword(body: {
        email: string;
    }): Promise<{
        message: string;
    }>;
    resetPassword(body: {
        token: string;
        newPassword: string;
    }): Promise<{
        message: string;
    }>;
}
