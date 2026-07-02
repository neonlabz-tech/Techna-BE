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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnnouncementsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const announcement_schema_1 = require("./schemas/announcement.schema");
let AnnouncementsService = class AnnouncementsService {
    constructor(announcementModel) {
        this.announcementModel = announcementModel;
    }
    async create(dto) {
        return this.announcementModel.create({
            ...dto,
            audience: 'All Students',
            batch: dto.batch?.trim() || 'None',
            author: dto.author || 'Super Admin',
        });
    }
    async findAll() {
        return this.announcementModel.find().sort({ createdAt: -1 });
    }
    async update(id, dto) {
        const updated = await this.announcementModel.findByIdAndUpdate(id, {
            ...dto,
            audience: 'All Students',
            batch: dto.batch?.trim() || 'None',
            author: dto.author || 'Super Admin',
        }, { new: true });
        if (!updated)
            throw new common_1.NotFoundException('Announcement not found');
        return updated;
    }
    async remove(id) {
        const deleted = await this.announcementModel.findByIdAndDelete(id);
        if (!deleted)
            throw new common_1.NotFoundException('Announcement not found');
        return { message: 'Announcement deleted successfully' };
    }
};
exports.AnnouncementsService = AnnouncementsService;
exports.AnnouncementsService = AnnouncementsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(announcement_schema_1.Announcement.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], AnnouncementsService);
//# sourceMappingURL=announcements.service.js.map