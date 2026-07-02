import { CreateResultDto } from './dto/create-result.dto';
import { UpdateResultDto } from './dto/update-result.dto';
import { ResultsService } from './results.service';
export declare class ResultsController {
    private readonly resultsService;
    constructor(resultsService: ResultsService);
    create(dto: CreateResultDto): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/result.schema").Result, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/result.schema").Result & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("./schemas/result.schema").Result, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/result.schema").Result & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    findAll(): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/result.schema").Result, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/result.schema").Result & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[]>;
    findByStudentId(studentId: string): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/result.schema").Result, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/result.schema").Result & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[]>;
    getStudentModules(studentId: string): Promise<{
        studentId: string;
        studentName: string;
        batch: string;
        modules: string[];
    }>;
    findOne(id: string): Promise<import("mongoose").Document<unknown, {}, import("./schemas/result.schema").Result, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/result.schema").Result & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    update(id: string, dto: UpdateResultDto): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/result.schema").Result, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/result.schema").Result & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>) | null>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
