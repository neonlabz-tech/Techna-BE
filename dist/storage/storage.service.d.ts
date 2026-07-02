import { ConfigService } from '@nestjs/config';
import type { StorageObjectResult, StorageUploadInput } from './storage.interfaces';
export declare const STORAGE_CONFIG_TOKEN = "storage-config";
export declare class StorageService {
    private readonly configService;
    private readonly logger;
    private readonly s3Client;
    private readonly bucketName;
    private readonly publicBaseUrl;
    constructor(configService: ConfigService);
    uploadFile(key: string, buffer: Buffer, mimeType: string): Promise<string>;
    deleteFile(key: string): Promise<void>;
    uploadProfilePhoto(input: StorageUploadInput): Promise<StorageObjectResult>;
    uploadQrImage(input: StorageUploadInput): Promise<StorageObjectResult>;
    uploadNoteAsset(input: StorageUploadInput): Promise<StorageObjectResult>;
    deleteObject(key: string): Promise<void>;
    private uploadObject;
    private buildObjectKey;
    private sanitizeFileName;
    private sanitizeSegment;
    private getFileExtension;
}
