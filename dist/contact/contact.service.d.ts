import { ConfigService } from '@nestjs/config';
import { EmailService } from '../email/email.service';
import { CreateContactDto } from './dto/create-contact.dto';
export declare class ContactService {
    private readonly emailService;
    private readonly configService;
    private readonly logger;
    constructor(emailService: EmailService, configService: ConfigService);
    sendContactMessage(dto: CreateContactDto): Promise<void>;
}
