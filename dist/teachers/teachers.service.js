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
exports.TeachersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const bcrypt = __importStar(require("bcryptjs"));
const teacher_schema_1 = require("./schemas/teacher.schema");
const storage_service_1 = require("../storage/storage.service");
let TeachersService = class TeachersService {
    constructor(teacherModel, storageService) {
        this.teacherModel = teacherModel;
        this.storageService = storageService;
    }
    async findAll(status) {
        const filter = status ? { status } : {};
        return this.teacherModel.find(filter).select('-password').lean();
    }
    async findOne(id) {
        const teacher = await this.teacherModel
            .findById(id)
            .select('-password')
            .lean();
        if (!teacher)
            throw new common_1.NotFoundException('Teacher not found');
        return teacher;
    }
    async create(data) {
        if (data.password) {
            data.password = await bcrypt.hash(data.password, 10);
        }
        const teacher = await this.teacherModel.create(data);
        const { password, ...result } = teacher.toObject();
        return result;
    }
    async update(id, data) {
        if (data.password) {
            data.password = await bcrypt.hash(data.password, 10);
        }
        const teacher = await this.teacherModel
            .findByIdAndUpdate(id, data, { new: true, runValidators: true })
            .select('-password')
            .lean();
        if (!teacher)
            throw new common_1.NotFoundException('Teacher not found');
        return teacher;
    }
    async remove(id) {
        const teacher = await this.teacherModel.findByIdAndDelete(id).lean();
        if (!teacher)
            throw new common_1.NotFoundException('Teacher not found');
        return { message: 'Teacher deleted successfully' };
    }
    async removePhoto(id) {
        const teacher = await this.teacherModel.findById(id);
        if (!teacher)
            throw new common_1.NotFoundException('Teacher not found');
        if (teacher.photoKey) {
            try {
                await this.storageService.deleteFile(teacher.photoKey);
            }
            catch (e) {
                console.error('[Teacher] Failed to delete photo from R2:', e);
            }
        }
        teacher.photoUrl = undefined;
        teacher.photoKey = undefined;
        await teacher.save();
        const { password, ...result } = teacher.toObject();
        return result;
    }
    async uploadPhoto(id, file) {
        if (!file)
            throw new common_1.BadRequestException('No file provided');
        if (!file.buffer || file.buffer.length === 0) {
            throw new common_1.BadRequestException('File buffer is empty');
        }
        console.log('[Teacher] uploadPhoto called:', {
            id,
            filename: file.originalname,
            size: file.size,
            mimetype: file.mimetype,
        });
        const teacher = await this.teacherModel.findById(id);
        if (!teacher)
            throw new common_1.NotFoundException('Teacher not found');
        if (teacher.photoKey) {
            try {
                await this.storageService.deleteFile(teacher.photoKey);
            }
            catch (e) {
                console.error('[Teacher] Failed to delete old photo:', e);
            }
        }
        const ext = file.originalname.split('.').pop()?.toLowerCase() || 'jpg';
        const key = `teachers/${id}-${Date.now()}.${ext}`;
        const photoUrl = await this.storageService.uploadFile(key, file.buffer, file.mimetype);
        teacher.photoUrl = photoUrl;
        teacher.photoKey = key;
        await teacher.save();
        console.log('[Teacher] Photo saved:', photoUrl);
        const { password, ...result } = teacher.toObject();
        return result;
    }
};
exports.TeachersService = TeachersService;
exports.TeachersService = TeachersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(teacher_schema_1.Teacher.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        storage_service_1.StorageService])
], TeachersService);
//# sourceMappingURL=teachers.service.js.map