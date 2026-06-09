import { randomUUID } from 'crypto';
import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { STORAGE_FOLDERS, type StorageFolder } from './storage.constants';
import type {
  StorageObjectResult,
  StorageUploadInput,
} from './storage.interfaces';

export const STORAGE_CONFIG_TOKEN = 'storage-config';

type StorageConfig = {
  accountId?: string;
  accessKeyId?: string;
  secretAccessKey?: string;
  bucketName?: string;
  endpoint?: string;
  publicBaseUrl?: string;
};

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private readonly client: S3Client | null;
  private readonly bucketName: string | null;
  private readonly publicBaseUrl: string | null;

  constructor(
    @Inject(STORAGE_CONFIG_TOKEN) private readonly storageConfig: StorageConfig,
  ) {
    this.bucketName = storageConfig.bucketName?.trim() || null;
    this.publicBaseUrl = storageConfig.publicBaseUrl?.trim() || null;
    this.client = this.buildClient(storageConfig);

    if (!this.client) {
      this.logger.warn(
        'Cloudflare R2 is not fully configured yet. Uploads will fail until the R2 env vars are provided.',
      );
    }
  }

  async uploadProfilePhoto(
    input: StorageUploadInput,
  ): Promise<StorageObjectResult> {
    return this.uploadObject(STORAGE_FOLDERS.profilePhotos, input);
  }

  async uploadQrImage(input: StorageUploadInput): Promise<StorageObjectResult> {
    return this.uploadObject(STORAGE_FOLDERS.qrImages, input);
  }

  async uploadNoteAsset(
    input: StorageUploadInput,
  ): Promise<StorageObjectResult> {
    return this.uploadObject(STORAGE_FOLDERS.notes, input);
  }

  async deleteObject(key: string): Promise<void> {
    const { client, bucketName } = this.getConfiguredStorage();

    await client.send(
      new DeleteObjectCommand({
        Bucket: bucketName,
        Key: key,
      }),
    );
  }

  private async uploadObject(
    folder: StorageFolder,
    input: StorageUploadInput,
  ): Promise<StorageObjectResult> {
    const { client, bucketName } = this.getConfiguredStorage();

    const key = this.buildObjectKey(folder, input.originalName, input.scope);

    const response = await client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: input.body,
        ContentType: input.contentType,
        Metadata: input.metadata,
      }),
    );

    return {
      bucket: bucketName,
      folder,
      key,
      publicUrl: this.buildPublicUrl(key),
      etag: response.ETag,
    };
  }

  private buildClient(storageConfig: StorageConfig): S3Client | null {
    if (
      !storageConfig.accountId ||
      !storageConfig.accessKeyId ||
      !storageConfig.secretAccessKey ||
      !storageConfig.bucketName
    ) {
      return null;
    }

    const endpoint =
      storageConfig.endpoint?.trim() ||
      this.getDefaultEndpoint(storageConfig.accountId);

    return new S3Client({
      region: 'auto',
      endpoint,
      forcePathStyle: true,
      credentials: {
        accessKeyId: storageConfig.accessKeyId,
        secretAccessKey: storageConfig.secretAccessKey,
      },
    });
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

  private buildPublicUrl(key: string): string | null {
    if (!this.publicBaseUrl) {
      return null;
    }

    return new URL(
      key,
      this.publicBaseUrl.endsWith('/')
        ? this.publicBaseUrl
        : `${this.publicBaseUrl}/`,
    ).toString();
  }

  private getDefaultEndpoint(accountId: string): string {
    return `https://${accountId}.r2.cloudflarestorage.com`;
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

  private getConfiguredStorage(): { client: S3Client; bucketName: string } {
    if (!this.client || !this.bucketName) {
      throw new Error(
        'Cloudflare R2 is not configured. Set CLOUDFLARE_R2_ACCOUNT_ID, CLOUDFLARE_R2_ACCESS_KEY_ID, CLOUDFLARE_R2_SECRET_ACCESS_KEY, and CLOUDFLARE_R2_BUCKET_NAME.',
      );
    }

    return {
      client: this.client,
      bucketName: this.bucketName,
    };
  }
}
