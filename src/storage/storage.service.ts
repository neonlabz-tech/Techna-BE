import { randomUUID } from 'crypto';
import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { STORAGE_FOLDERS, type StorageFolder } from './storage.constants';
import type {
  StorageObjectResult,
  StorageUploadInput,
} from './storage.interfaces';

// Kept for any existing code that imports this token
export const STORAGE_CONFIG_TOKEN = 'storage-config';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private readonly s3Client: S3Client;
  private readonly bucketName: string;
  private readonly publicBaseUrl: string;

  constructor(private readonly configService: ConfigService) {
    const accountId = configService.get<string>('CLOUDFLARE_R2_ACCOUNT_ID', '');
    const accessKeyId = configService.get<string>('CLOUDFLARE_R2_ACCESS_KEY_ID', '');
    const secretAccessKey = configService.get<string>('CLOUDFLARE_R2_SECRET_ACCESS_KEY', '');

    this.bucketName = configService.get<string>('CLOUDFLARE_R2_BUCKET_NAME', '');
    this.publicBaseUrl = configService
      .get<string>('CLOUDFLARE_R2_PUBLIC_BASE_URL', '')
      .trim()
      .replace(/\/$/, '');

    const endpoint =
      configService.get<string>('CLOUDFLARE_R2_ENDPOINT', '').trim() ||
      (accountId ? `https://${accountId}.r2.cloudflarestorage.com` : '');

    if (!accessKeyId || !secretAccessKey || !this.bucketName) {
      this.logger.warn(
        'Cloudflare R2 is not fully configured yet. Uploads will fail until the R2 env vars are provided.',
      );
    }

    this.s3Client = new S3Client({
      region: 'auto',
      endpoint,
      credentials: { accessKeyId, secretAccessKey },
      forcePathStyle: true,
    });
  }

  // ─── Direct upload/delete (used by teachers, notes, etc.) ──────────────────

  async uploadFile(key: string, buffer: Buffer, mimeType: string): Promise<string> {
    this.logger.log(`[R2] Uploading to bucket: ${this.bucketName}, key: ${key}`);

    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: buffer,
        ContentType: mimeType,
      }),
    );

    const publicUrl = `${this.publicBaseUrl}/${key}`;
    this.logger.log(`[R2] Upload success. Public URL: ${publicUrl}`);
    return publicUrl;
  }

  async deleteFile(key: string): Promise<void> {
    await this.s3Client.send(
      new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      }),
    );
    this.logger.log(`[R2] Deleted key: ${key}`);
  }

  // ─── Higher-level helpers (used by students / QR codes / notes) ────────────

  async uploadProfilePhoto(input: StorageUploadInput): Promise<StorageObjectResult> {
    return this.uploadObject(STORAGE_FOLDERS.profilePhotos, input);
  }

  async uploadQrImage(input: StorageUploadInput): Promise<StorageObjectResult> {
    return this.uploadObject(STORAGE_FOLDERS.qrImages, input);
  }

  async uploadNoteAsset(input: StorageUploadInput): Promise<StorageObjectResult> {
    return this.uploadObject(STORAGE_FOLDERS.notes, input);
  }

  async deleteObject(key: string): Promise<void> {
    return this.deleteFile(key);
  }

  // ─── Internal ──────────────────────────────────────────────────────────────

  private async uploadObject(
    folder: StorageFolder,
    input: StorageUploadInput,
  ): Promise<StorageObjectResult> {
    const key = this.buildObjectKey(folder, input.originalName, input.scope);
    const publicUrl = await this.uploadFile(
      key,
      input.body as Buffer,
      input.contentType ?? 'application/octet-stream',
    );

    return {
      bucket: this.bucketName,
      folder,
      key,
      publicUrl,
      etag: undefined,
    };
  }

  private buildObjectKey(
    folder: StorageFolder,
    originalName: string,
    scope?: string,
  ): string {
    const sanitizedName = this.sanitizeFileName(originalName);
    const prefix = scope ? `${this.sanitizeSegment(scope)}/` : '';
    return `${folder}/${prefix}${randomUUID()}-${sanitizedName}`;
  }

  private sanitizeFileName(fileName: string): string {
    return (
      this.sanitizeSegment(fileName.replace(/\.[^.]+$/, '')) +
      this.getFileExtension(fileName)
    );
  }

  private sanitizeSegment(value: string): string {
    return (
      value
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9-_]+/g, '-')
        .replace(/-{2,}/g, '-')
        .replace(/^-+|-+$/g, '') || 'file'
    );
  }

  private getFileExtension(fileName: string): string {
    const extensionMatch = fileName.match(/(\.[^.]+)$/);
    return extensionMatch?.[1] ?? '';
  }
}
