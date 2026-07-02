import { CreateExamNoticeDto } from './dto/create-exam-notice.dto';
import { UpdateExamNoticeDto } from './dto/update-exam-notice.dto';
import { ExamNoticesService } from './exam-notices.service';
export declare class ExamNoticesController {
    private readonly examNoticesService;
    constructor(examNoticesService: ExamNoticesService);
    create(createExamNoticeDto: CreateExamNoticeDto): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/exam-notice.schema").ExamNotice, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/exam-notice.schema").ExamNotice & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("./schemas/exam-notice.schema").ExamNotice, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/exam-notice.schema").ExamNotice & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    findAll(): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/exam-notice.schema").ExamNotice, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/exam-notice.schema").ExamNotice & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("./schemas/exam-notice.schema").ExamNotice, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/exam-notice.schema").ExamNotice & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[]>;
    findPublished(): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/exam-notice.schema").ExamNotice, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/exam-notice.schema").ExamNotice & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("./schemas/exam-notice.schema").ExamNotice, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/exam-notice.schema").ExamNotice & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[]>;
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
    getResultsByStudentIdPublic(studentId: string): Promise<{
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
    findOne(id: string): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/exam-notice.schema").ExamNotice, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/exam-notice.schema").ExamNotice & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("./schemas/exam-notice.schema").ExamNotice, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/exam-notice.schema").ExamNotice & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    update(id: string, updateExamNoticeDto: UpdateExamNoticeDto): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/exam-notice.schema").ExamNotice, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/exam-notice.schema").ExamNotice & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("./schemas/exam-notice.schema").ExamNotice, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/exam-notice.schema").ExamNotice & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    publish(id: string): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/exam-notice.schema").ExamNotice, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/exam-notice.schema").ExamNotice & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("./schemas/exam-notice.schema").ExamNotice, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/exam-notice.schema").ExamNotice & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    unpublish(id: string): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/exam-notice.schema").ExamNotice, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/exam-notice.schema").ExamNotice & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("./schemas/exam-notice.schema").ExamNotice, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/exam-notice.schema").ExamNotice & {
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
}
