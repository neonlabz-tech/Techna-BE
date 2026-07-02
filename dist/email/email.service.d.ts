import { ConfigService } from '@nestjs/config';
interface StudentEmailPayload {
    email: string;
    name: string;
    studentId: string;
}
interface StudentRejectionEmailPayload extends StudentEmailPayload {
    reason: string;
}
export declare class EmailService {
    private readonly configService;
    private readonly logger;
    private transporter;
    private readonly fromEmail;
    constructor(configService: ConfigService);
    sendRegistrationEmail(payload: StudentEmailPayload): Promise<void>;
    sendApprovalEmail(payload: StudentEmailPayload): Promise<void>;
    sendRejectionEmail(payload: StudentRejectionEmailPayload): Promise<void>;
    sendPasswordResetEmail(payload: {
        email: string;
        name: string;
        resetToken: string;
    }): Promise<void>;
    sendContactEmail(payload: {
        adminEmail: string;
        name: string;
        email: string;
        phone: string;
        subject: string;
        message: string;
    }): Promise<void>;
    private sendStudentEmail;
    private toTitleCase;
    private escapeHtml;
}
export {};
