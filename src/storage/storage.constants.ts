export const STORAGE_FOLDERS = {
  profilePhotos: 'profile',
  qrImages: 'QR',
  notes: 'Notes',
} as const;

export type StorageFolder =
  (typeof STORAGE_FOLDERS)[keyof typeof STORAGE_FOLDERS];
