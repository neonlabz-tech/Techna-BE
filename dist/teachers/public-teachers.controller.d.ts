import { Model } from 'mongoose';
import { Teacher } from './schemas/teacher.schema';
export declare class PublicTeachersController {
    private readonly teacherModel;
    constructor(teacherModel: Model<Teacher>);
    findAllPublic(): Promise<(Teacher & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    findBySubject(subjectName: string): Promise<Teacher & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    findPublicById(id: string): Promise<Teacher & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
}
