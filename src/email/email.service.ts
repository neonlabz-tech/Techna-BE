import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

interface StudentEmailPayload {
  email: string;
  name: string;
  studentId: string;
}

interface StudentRejectionEmailPayload extends StudentEmailPayload {
  reason: string;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly resend: Resend | null;
  private readonly fromEmail: string;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('RESEND_API_KEY');

    this.resend = apiKey ? new Resend(apiKey) : null;
    this.fromEmail =
      this.configService.get<string>('RESEND_FROM_EMAIL') ||
      'Techna <onboarding@resend.dev>';
  }

  async sendRegistrationEmail(payload: StudentEmailPayload): Promise<void> {
    await this.sendStudentEmail({
      to: payload.email,
      subject: 'Registration Received',
      text: [
        `Hello ${payload.name},`,
        '',
        'We received your registration.',
        `Student Name: ${payload.name}`,
        `Student ID: ${payload.studentId}`,
        '',
        'We will notify you when your registration status changes.',
      ].join('\n'),
      html: `
        <p>Hello ${this.escapeHtml(payload.name)},</p>
        <p>We received your registration.</p>
        <p><strong>Student Name:</strong> ${this.escapeHtml(payload.name)}</p>
        <p><strong>Student ID:</strong> ${this.escapeHtml(payload.studentId)}</p>
        <p>We will notify you when your registration status changes.</p>
      `,
    });
  }

  async sendApprovalEmail(payload: StudentEmailPayload): Promise<void> {
    await this.sendStudentEmail({
      to: payload.email,
      subject: 'Your Techna Account Has Been Approved!',
      text: [
        `Hello ${payload.name},`,
        '',
        'Congratulations! Your registration has been approved.',
        `Student Name: ${payload.name}`,
        `Student ID: ${payload.studentId}`,
        '',
        'You can now log in to the Techna student portal using your registered email and password.',
        '',
        'Welcome to Techna!',
      ].join('\n'),
      html: `
        <p>Hello ${this.escapeHtml(payload.name)},</p>
        <p><strong>Congratulations!</strong> Your registration has been approved.</p>
        <p><strong>Student Name:</strong> ${this.escapeHtml(payload.name)}</p>
        <p><strong>Student ID:</strong> ${this.escapeHtml(payload.studentId)}</p>
        <p>You can now log in to the Techna student portal using your registered email and password.</p>
        <p>Welcome to Techna!</p>
      `,
    });
  }

  async sendRejectionEmail(
    payload: StudentRejectionEmailPayload,
  ): Promise<void> {
    await this.sendStudentEmail({
      to: payload.email,
      subject: 'Registration Rejected',
      text: [
        `Hello ${payload.name},`,
        '',
        'Your registration has been rejected.',
        `Student Name: ${payload.name}`,
        `Student ID: ${payload.studentId}`,
        `Reason: ${payload.reason}`,
        '',
        'Please contact the administration team if you need more information.',
      ].join('\n'),
      html: `
        <p>Hello ${this.escapeHtml(payload.name)},</p>
        <p>Your registration has been rejected.</p>
        <p><strong>Student Name:</strong> ${this.escapeHtml(payload.name)}</p>
        <p><strong>Student ID:</strong> ${this.escapeHtml(payload.studentId)}</p>
        <p><strong>Reason:</strong> ${this.escapeHtml(payload.reason)}</p>
        <p>Please contact the administration team if you need more information.</p>
      `,
    });
  }

  private async sendStudentEmail(email: {
    to: string;
    subject: string;
    text: string;
    html: string;
  }): Promise<void> {
    if (!email.to?.trim()) {
      this.logger.error(
        `Failed to send "${email.subject}" email: recipient email is missing`,
      );
      return;
    }

    if (!this.resend) {
      this.logger.error(
        `Failed to send "${email.subject}" email to ${email.to}: RESEND_API_KEY is not configured`,
      );
      return;
    }

    try {
      const result = await this.resend.emails.send({
        from: this.fromEmail,
        to: email.to,
        subject: email.subject,
        text: email.text,
        html: email.html,
      });

      if (result.error) {
        this.logEmailFailure(email.subject, email.to, result.error.message);
      }
    } catch (error) {
      this.logEmailFailure(
        email.subject,
        email.to,
        error instanceof Error ? error.message : String(error),
      );
    }
  }

  private logEmailFailure(subject: string, to: string, message: string): void {
    const isResendTestRecipientError = message.includes(
      'You can only send testing emails to your own email address',
    );

    const logMessage = `Skipped "${subject}" email to ${to}: ${message}`;

    if (isResendTestRecipientError) {
      this.logger.warn(logMessage);
      return;
    }

    this.logger.error(logMessage);
  }

  private escapeHtml(value: string): string {
    return value
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }
}
