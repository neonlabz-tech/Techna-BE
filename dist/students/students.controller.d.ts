import { Role } from '../enums/role.enum';
import { RejectStudentDto } from './dto/reject-student.dto';
import { StudentsService } from './students.service';
import type { CreateStudentPayload, UpdateStudentPayload } from './students.service';
interface AuthenticatedRequest {
    user: {
        role: Role;
        userId: string;
    };
}
export declare class StudentsController {
    private readonly studentsService;
    constructor(studentsService: StudentsService);
    register(payload: string, profilePhoto?: Express.Multer.File): Promise<{
        message: string;
        data: {
            password?: string;
        };
    }>;
    findAll(status?: 'pending' | 'approved' | 'rejected'): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/student.schema").Student, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/student.schema").Student & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[]>;
    getBatches(): Promise<string[]>;
    findOne(id: string, req: AuthenticatedRequest): Promise<import("mongoose").Document<unknown, {}, import("./schemas/student.schema").Student, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/student.schema").Student & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    getEnrolmentHistory(id: string, req: AuthenticatedRequest): Promise<import("./dto/enrolment-history.dto").EnrolmentHistoryDto>;
    create(body: CreateStudentPayload): Promise<{
        password?: string;
    }>;
    update(id: string, body: UpdateStudentPayload, req: AuthenticatedRequest): Promise<import("mongoose").Document<unknown, {}, import("./schemas/student.schema").Student, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/student.schema").Student & {
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
    approveStudent(id: string): Promise<import("./schemas/student.schema").Student>;
    rejectStudent(id: string, rejectStudentDto: RejectStudentDto): Promise<object>;
    generateStudentQrCode(studentId: string): Promise<import("./schemas/student.schema").Student>;
}
export {};
