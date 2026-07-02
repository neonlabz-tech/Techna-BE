export declare const STORAGE_FOLDERS: {
    readonly profilePhotos: "profile";
    readonly qrImages: "QR";
    readonly notes: "Notes";
};
export type StorageFolder = (typeof STORAGE_FOLDERS)[keyof typeof STORAGE_FOLDERS];
