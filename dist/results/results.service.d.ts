import { Model, Types } from 'mongoose';
import { CreateResultDto } from './dto/create-result.dto';
import { UpdateResultDto } from './dto/update-result.dto';
import { Result, ResultDocument } from './schemas/result.schema';
import { StudentDocument } from '../students/schemas/student.schema';
export declare class ResultsService {
    private readonly resultModel;
    private readonly studentModel;
    constructor(resultModel: Model<ResultDocument>, studentModel: Model<StudentDocument>);
    create(dto: CreateResultDto): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Result, {}, import("mongoose").DefaultSchemaOptions> & Result & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, Result, {}, import("mongoose").DefaultSchemaOptions> & Result & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: Types.ObjectId;
    }>>;
    findAll(): Promise<(import("mongoose").Document<unknown, {}, Result, {}, import("mongoose").DefaultSchemaOptions> & Result & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: Types.ObjectId;
    }>)[]>;
    findOne(id: string): Promise<import("mongoose").Document<unknown, {}, Result, {}, import("mongoose").DefaultSchemaOptions> & Result & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: Types.ObjectId;
    }>>;
    findByStudentId(studentId: string): Promise<(import("mongoose").Document<unknown, {}, Result, {}, import("mongoose").DefaultSchemaOptions> & Result & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: Types.ObjectId;
    }>)[]>;
    update(id: string, dto: UpdateResultDto): Promise<(import("mongoose").Document<unknown, {}, Result, {}, import("mongoose").DefaultSchemaOptions> & Result & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: Types.ObjectId;
    }>) | null>;
    remove(id: string): Promise<{
        message: string;
    }>;
    getStudentEnrolledModules(studentId: string): Promise<{
        studentId: string;
        studentName: string;
        batch: string;
        modules: string[];
    }>;
    private calculateGrade;
    private getStudentModules;
}
