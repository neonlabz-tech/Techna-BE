import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EmailService } from '../email/email.service';
import { CreateContactDto } from './dto/create-contact.dto';

@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name);

  constructor(
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
  ) {}

  async sendContactMessage(dto: CreateContactDto): Promise<void> {
    const recipientEmail = this.configService.get<string>('GMAIL_USER');

    if (!recipientEmail) {
      this.logger.error('GMAIL_USER not configured in .env');
      throw new Error('Recipient email is not configured');
    }

    await this.emailService.sendContactEmail({
      adminEmail: recipientEmail,
      name: dto.name,
      email: dto.email,
      phone: dto.phone || 'Not provided',
      subject: dto.subject,
      message: dto.message,
    });

    this.logger.log(
      `Contact message from ${dto.name} (${dto.email}) sent to ${recipientEmail}`,
    );
  }
}
