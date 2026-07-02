import { Model } from 'mongoose';
import { CreateExamNoticeDto } from './dto/create-exam-notice.dto';
import { UpdateExamNoticeDto } from './dto/update-exam-notice.dto';
import { ExamNotice, ExamNoticeDocument } from './schemas/exam-notice.schema';
import { NotificationsService } from '../notifications/notifications.service';
import { ResultDocument } from '../results/schemas/result.schema';
export declare class ExamNoticesService {
    private readonly examNoticeModel;
    private readonly notificationsService;
    private readonly studentModel;
    private readonly resultModel;
    constructor(examNoticeModel: Model<ExamNoticeDocument>, notificationsService: NotificationsService, studentModel: Model<any>, resultModel: Model<ResultDocument>);
    create(createExamNoticeDto: CreateExamNoticeDto): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, ExamNotice, {}, import("mongoose").DefaultSchemaOptions> & ExamNotice & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, ExamNotice, {}, import("mongoose").DefaultSchemaOptions> & ExamNotice & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    findAll(): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, ExamNotice, {}, import("mongoose").DefaultSchemaOptions> & ExamNotice & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, ExamNotice, {}, import("mongoose").DefaultSchemaOptions> & ExamNotice & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[]>;
    findPublished(): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, ExamNotice, {}, import("mongoose").DefaultSchemaOptions> & ExamNotice & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, ExamNotice, {}, import("mongoose").DefaultSchemaOptions> & ExamNotice & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[]>;
    findOne(id: string): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, ExamNotice, {}, import("mongoose").DefaultSchemaOptions> & ExamNotice & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, ExamNotice, {}, import("mongoose").DefaultSchemaOptions> & ExamNotice & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    update(id: string, updateExamNoticeDto: UpdateExamNoticeDto): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, ExamNotice, {}, import("mongoose").DefaultSchemaOptions> & ExamNotice & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, ExamNotice, {}, import("mongoose").DefaultSchemaOptions> & ExamNotice & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    publish(id: string): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, ExamNotice, {}, import("mongoose").DefaultSchemaOptions> & ExamNotice & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, ExamNotice, {}, import("mongoose").DefaultSchemaOptions> & ExamNotice & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    unpublish(id: string): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, ExamNotice, {}, import("mongoose").DefaultSchemaOptions> & ExamNotice & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, ExamNotice, {}, import("mongoose").DefaultSchemaOptions> & ExamNotice & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    remove(id: string): Promise<{
        message: string;
    }>;
    getResultsByStudentId(studentId: string): Promise<{
        student: {
            studentId: any;
            fullNameEnglish: any;
            email: any;
            admissionNumber: any;
            nicNo: any;
            whatsappNo: any;
            batch: any;
            modules: string[];
        };
        results: any[];
        summary: {
            totalResults: number;
            passed: number;
            failed: number;
            averageScore: number;
        };
    }>;
}
