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
var StorageService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageService = exports.STORAGE_CONFIG_TOKEN = void 0;
const crypto_1 = require("crypto");
const client_s3_1 = require("@aws-sdk/client-s3");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const storage_constants_1 = require("./storage.constants");
exports.STORAGE_CONFIG_TOKEN = 'storage-config';
let StorageService = StorageService_1 = class StorageService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(StorageService_1.name);
        const accountId = configService.get('CLOUDFLARE_R2_ACCOUNT_ID', '');
        const accessKeyId = configService.get('CLOUDFLARE_R2_ACCESS_KEY_ID', '');
        const secretAccessKey = configService.get('CLOUDFLARE_R2_SECRET_ACCESS_KEY', '');
        this.bucketName = configService.get('CLOUDFLARE_R2_BUCKET_NAME', '');
        this.publicBaseUrl = configService
            .get('CLOUDFLARE_R2_PUBLIC_BASE_URL', '')
            .trim()
            .replace(/\/$/, '');
        const endpoint = configService.get('CLOUDFLARE_R2_ENDPOINT', '').trim() ||
            (accountId ? `https://${accountId}.r2.cloudflarestorage.com` : '');
        if (!accessKeyId || !secretAccessKey || !this.bucketName) {
            this.logger.warn('Cloudflare R2 is not fully configured yet. Uploads will fail until the R2 env vars are provided.');
        }
        this.s3Client = new client_s3_1.S3Client({
            region: 'auto',
            endpoint,
            credentials: { accessKeyId, secretAccessKey },
            forcePathStyle: true,
        });
    }
    async uploadFile(key, buffer, mimeType) {
        this.logger.log(`[R2] Uploading to bucket: ${this.bucketName}, key: ${key}`);
        await this.s3Client.send(new client_s3_1.PutObjectCommand({
            Bucket: this.bucketName,
            Key: key,
            Body: buffer,
            ContentType: mimeType,
        }));
        const publicUrl = `${this.publicBaseUrl}/${key}`;
        this.logger.log(`[R2] Upload success. Public URL: ${publicUrl}`);
        return publicUrl;
    }
    async deleteFile(key) {
        await this.s3Client.send(new client_s3_1.DeleteObjectCommand({
            Bucket: this.bucketName,
            Key: key,
        }));
        this.logger.log(`[R2] Deleted key: ${key}`);
    }
    async uploadProfilePhoto(input) {
        return this.uploadObject(storage_constants_1.STORAGE_FOLDERS.profilePhotos, input);
    }
    async uploadQrImage(input) {
        return this.uploadObject(storage_constants_1.STORAGE_FOLDERS.qrImages, input);
    }
    async uploadNoteAsset(input) {
        return this.uploadObject(storage_constants_1.STORAGE_FOLDERS.notes, input);
    }
    async deleteObject(key) {
        return this.deleteFile(key);
    }
    async uploadObject(folder, input) {
        const key = this.buildObjectKey(folder, input.originalName, input.scope);
        const publicUrl = await this.uploadFile(key, input.body, input.contentType ?? 'application/octet-stream');
        return {
            bucket: this.bucketName,
            folder,
            key,
            publicUrl,
            etag: undefined,
        };
    }
    buildObjectKey(folder, originalName, scope) {
        const sanitizedName = this.sanitizeFileName(originalName);
        const prefix = scope ? `${this.sanitizeSegment(scope)}/` : '';
        return `${folder}/${prefix}${(0, crypto_1.randomUUID)()}-${sanitizedName}`;
    }
    sanitizeFileName(fileName) {
        return (this.sanitizeSegment(fileName.replace(/\.[^.]+$/, '')) +
            this.getFileExtension(fileName));
    }
    sanitizeSegment(value) {
        return (value
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9-_]+/g, '-')
            .replace(/-{2,}/g, '-')
            .replace(/^-+|-+$/g, '') || 'file');
    }
    getFileExtension(fileName) {
        const extensionMatch = fileName.match(/(\.[^.]+)$/);
        return extensionMatch?.[1] ?? '';
    }
};
exports.StorageService = StorageService;
exports.StorageService = StorageService = StorageService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], StorageService);
//# sourceMappingURL=storage.service.js.map