import { Model, Types } from 'mongoose';
import { EmailService } from '../email/email.service';
import { StorageService } from '../storage/storage.service';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationsAutoService } from '../notifications/notifications-auto.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { EnrolmentHistoryDto } from './dto/enrolment-history.dto';
import { RegisterStudentDto } from './dto/register-student.dto';
import { RejectStudentDto } from './dto/reject-student.dto';
import { CounterDocument } from './schemas/counter.schema';
import { Student, StudentDocument } from './schemas/student.schema';
export type CreateStudentPayload = CreateStudentDto & {
    password?: string;
    studentId?: string;
    qrToken?: string;
    enrolledAt?: string;
    status?: 'pending' | 'approved' | 'rejected';
};
export type UpdateStudentPayload = Partial<CreateStudentPayload>;
export declare class StudentsService {
    private readonly studentModel;
    private readonly counterModel;
    private readonly emailService;
    private readonly storageService;
    private readonly notificationsService;
    private readonly notificationsAutoService;
    private readonly logger;
    constructor(studentModel: Model<StudentDocument>, counterModel: Model<CounterDocument>, emailService: EmailService, storageService: StorageService, notificationsService: NotificationsService, notificationsAutoService: NotificationsAutoService);
    findAll(status?: 'pending' | 'approved' | 'rejected'): Promise<(import("mongoose").Document<unknown, {}, Student, {}, import("mongoose").DefaultSchemaOptions> & Student & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: Types.ObjectId;
    }>)[]>;
    getUniqueBatches(): Promise<string[]>;
    findOne(id: string): Promise<import("mongoose").Document<unknown, {}, Student, {}, import("mongoose").DefaultSchemaOptions> & Student & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: Types.ObjectId;
    }>>;
    registerStudent(dto: RegisterStudentDto, profilePhoto?: Express.Multer.File): Promise<{
        message: string;
        data: {
            password?: string;
        };
    }>;
    create(data: CreateStudentPayload): Promise<{
        password?: string;
    }>;
    update(id: string, data: UpdateStudentPayload): Promise<import("mongoose").Document<unknown, {}, Student, {}, import("mongoose").DefaultSchemaOptions> & Student & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: Types.ObjectId;
    }>>;
    remove(id: string): Promise<{
        message: string;
    }>;
    approveStudent(id: string): Promise<Student>;
    rejectStudent(id: string, dto: RejectStudentDto): Promise<object>;
    getEnrolmentHistory(targetId: string, requesterId: string, requesterRole: string): Promise<EnrolmentHistoryDto>;
    generateStudentQrCode(studentId: string): Promise<Student>;
    private resolveDateOfBirth;
    private generateStudentId;
    private generateReference;
    private findStudentByIdOrStudentId;
    private validateRegistration;
    private validateRequiredString;
    private isDuplicateKeyError;
}
