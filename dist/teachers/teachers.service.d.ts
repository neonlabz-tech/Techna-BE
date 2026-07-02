import { Model } from 'mongoose';
import { StorageService } from '../storage/storage.service';
export declare class TeachersService {
    private teacherModel;
    private readonly storageService;
    constructor(teacherModel: Model<any>, storageService: StorageService);
    findAll(status?: string): Promise<any[]>;
    findOne(id: string): Promise<any>;
    create(data: any): Promise<any>;
    update(id: string, data: any): Promise<any>;
    remove(id: string): Promise<{
        message: string;
    }>;
    removePhoto(id: string): Promise<any>;
    uploadPhoto(id: string, file: Express.Multer.File): Promise<any>;
}
