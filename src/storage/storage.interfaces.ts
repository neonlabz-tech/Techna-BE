import type { PutObjectCommandInput } from '@aws-sdk/client-s3';
import type { StorageFolder } from './storage.constants';

export interface StorageUploadInput {
  originalName: string;
  body: PutObjectCommandInput['Body'];
  contentType?: string;
  metadata?: Record<string, string>;
  scope?: string;
}

export interface StorageObjectResult {
  bucket: string;
  folder: StorageFolder;
  key: string;
  publicUrl: string | null;
  etag: string | undefined;
}
