import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { EmailService } from '../email/email.service';
import { CreateContactDto } from './dto/create-contact.dto';

@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name);

  constructor(
    private readonly emailService: EmailService,
  ) {}

  async sendContactMessage(dto: CreateContactDto): Promise<void> {
    const recipientEmail = 'support@techna.lk';

    try {
      await this.emailService.sendContactEmail({
        adminEmail: recipientEmail,
        name: dto.name,
        email: dto.email,
        phone: dto.phone || 'Not provided',
        subject: dto.subject,
        message: dto.message,
      });
    } catch (err) {
      this.logger.error(
        `Failed to deliver contact message from ${dto.name} (${dto.email})`,
        err instanceof Error ? err.stack : String(err),
      );
      throw new InternalServerErrorException(
        'Failed to send your message. Please try again later.',
      );
    }

    this.logger.log(
      `Contact message from ${dto.name} (${dto.email}) sent to ${recipientEmail}`,
    );
  }
}