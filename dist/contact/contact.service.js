"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ContactService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const email_service_1 = require("../email/email.service");
let ContactService = ContactService_1 = class ContactService {
    constructor(emailService, configService) {
        this.emailService = emailService;
        this.configService = configService;
        this.logger = new common_1.Logger(ContactService_1.name);
    }
    async sendContactMessage(dto) {
        const recipientEmail = this.configService.get('GMAIL_USER');
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
        this.logger.log(`Contact message from ${dto.name} (${dto.email}) sent to ${recipientEmail}`);
    }
};
exports.ContactService = ContactService;
exports.ContactService = ContactService = ContactService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [email_service_1.EmailService,
        config_1.ConfigService])
], ContactService);
//# sourceMappingURL=contact.service.js.map