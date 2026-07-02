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
exports.ModulesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const client_s3_1 = require("@aws-sdk/client-s3");
const mongoose_2 = require("mongoose");
const module_schema_1 = require("./schemas/module.schema");
const exceptions_1 = require("../common/exceptions");
let ModulesService = class ModulesService {
    constructor(moduleModel) {
        this.moduleModel = moduleModel;
        this.s3 = new client_s3_1.S3Client({
            region: 'auto',
            endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
            credentials: {
                accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
                secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
            },
        });
    }
    async create(createModuleDto) {
        try {
            const newModule = new this.moduleModel(createModuleDto);
            return await newModule.save();
        }
        catch (error) {
            throw new exceptions_1.InternalServerErrorException('Failed to create module: ' +
                (error instanceof Error ? error.message : 'Unknown error'));
        }
    }
    async findAll(status) {
        try {
            const filter = status ? { status } : {};
            return await this.moduleModel.find(filter).sort({ createdAt: -1 });
        }
        catch (error) {
            throw new exceptions_1.InternalServerErrorException('Failed to fetch modules: ' +
                (error instanceof Error ? error.message : 'Unknown error'));
        }
    }
    async findPublished() {
        try {
            const modules = await this.moduleModel
                .find({ status: 'active' })
                .sort({ createdAt: -1 })
                .lean();
            return modules.map((module) => ({
                ...module,
                resources: (module.resources ?? []).filter((resource) => resource.isPublished === true),
            }));
        }
        catch (error) {
            throw new exceptions_1.InternalServerErrorException('Failed to fetch published modules: ' +
                (error instanceof Error ? error.message : 'Unknown error'));
        }
    }
    async findOne(id) {
        try {
            const module = await this.moduleModel.findById(id);
            if (!module) {
                throw new exceptions_1.NotFoundException('Module not found');
            }
            return module;
        }
        catch (error) {
            if (error instanceof exceptions_1.NotFoundException) {
                throw error;
            }
            throw new exceptions_1.InternalServerErrorException('Failed to fetch module: ' +
                (error instanceof Error ? error.message : 'Unknown error'));
        }
    }
    async update(id, updateModuleDto) {
        try {
            const updatedModule = await this.moduleModel.findByIdAndUpdate(id, { $set: updateModuleDto }, { new: true, runValidators: true });
            if (!updatedModule) {
                throw new exceptions_1.NotFoundException('Module not found');
            }
            return updatedModule;
        }
        catch (error) {
            if (error instanceof exceptions_1.NotFoundException) {
                throw error;
            }
            throw new exceptions_1.InternalServerErrorException('Failed to update module: ' +
                (error instanceof Error ? error.message : 'Unknown error'));
        }
    }
    async remove(id) {
        try {
            const deletedModule = await this.moduleModel.findByIdAndDelete(id);
            if (!deletedModule) {
                throw new exceptions_1.NotFoundException('Module not found');
            }
            return {
                message: 'Module deleted successfully',
            };
        }
        catch (error) {
            if (error instanceof exceptions_1.NotFoundException) {
                throw error;
            }
            throw new exceptions_1.InternalServerErrorException('Failed to delete module: ' +
                (error instanceof Error ? error.message : 'Unknown error'));
        }
    }
    async uploadResource(id, file, title) {
        let folder = 'others';
        let fileType = 'file';
        if (file.mimetype.startsWith('video/')) {
            folder = 'videos';
            fileType = 'video';
        }
        else if (file.mimetype.startsWith('image/')) {
            folder = 'images';
            fileType = 'image';
        }
        else if (file.mimetype === 'application/pdf') {
            folder = 'pdfs';
            fileType = 'pdf';
        }
        const key = `modules/${folder}/${Date.now()}-${file.originalname}`;
        await this.s3.send(new client_s3_1.PutObjectCommand({
            Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
        }));
        const fileUrl = `${process.env.CLOUDFLARE_R2_PUBLIC_BASE_URL}/${key}`;
        return this.moduleModel.findByIdAndUpdate(id, {
            $push: {
                resources: {
                    title,
                    fileType,
                    fileUrl,
                    fileKey: key,
                },
            },
        }, { new: true });
    }
    async deleteResource(moduleId, resourceId) {
        const module = await this.moduleModel.findById(moduleId);
        if (!module) {
            throw new exceptions_1.NotFoundException('Module not found');
        }
        const resource = (module.resources ?? []).find((r) => r._id.toString() === resourceId);
        if (!resource) {
            throw new exceptions_1.NotFoundException('Resource not found');
        }
        await this.s3.send(new client_s3_1.DeleteObjectCommand({
            Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
            Key: resource.fileKey,
        }));
        module.resources = (module.resources ?? []).filter((r) => r._id.toString() !== resourceId);
        await module.save();
        return {
            message: 'Resource deleted successfully',
        };
    }
    async addResourceUrl(moduleId, dto) {
        const module = await this.moduleModel.findById(moduleId);
        if (!module) {
            throw new exceptions_1.NotFoundException('Module not found');
        }
        return this.moduleModel.findByIdAndUpdate(moduleId, {
            $push: {
                resources: {
                    title: dto.title,
                    url: dto.url,
                    thumbnailUrl: dto.thumbnailUrl,
                    fileType: dto.fileType ?? 'video',
                    description: dto.description,
                    uploadedAt: new Date(),
                    isPublished: dto.isPublished ?? false,
                },
            },
        }, { new: true });
    }
    async toggleResourcePublish(moduleId, resourceId) {
        const module = await this.moduleModel.findById(moduleId);
        if (!module)
            throw new exceptions_1.NotFoundException('Module not found');
        const resource = module.resources.id(resourceId);
        if (!resource)
            throw new exceptions_1.NotFoundException('Resource not found');
        resource.isPublished = !resource.isPublished;
        await module.save();
        return {
            resourceId,
            isPublished: resource.isPublished,
            message: resource.isPublished ? 'Video published' : 'Video unpublished',
        };
    }
    async updateResource(moduleId, resourceId, title) {
        const module = await this.moduleModel.findById(moduleId);
        if (!module) {
            throw new exceptions_1.NotFoundException('Module not found');
        }
        const resource = (module.resources ?? []).find((r) => r._id.toString() === resourceId);
        if (!resource) {
            throw new exceptions_1.NotFoundException('Resource not found');
        }
        resource.title = title;
        await module.save();
        return module;
    }
};
exports.ModulesService = ModulesService;
exports.ModulesService = ModulesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(module_schema_1.Module.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ModulesService);
//# sourceMappingURL=modules.service.js.map