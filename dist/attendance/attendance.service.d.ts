import { Model } from 'mongoose';
import { Student } from '../students/schemas/student.schema';
import { SchoolModuleDocument } from '../modules/schemas/module.schema';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { AttendanceReportQueryDto } from './dto/report-query.dto';
import { ScanAttendanceDto } from './dto/scan-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { AttendanceDocument } from './schemas/attendance.schema';
type AttendanceStatus = 'present' | 'absent';
type AttendanceReportItem = {
    id: string;
    studentId: string;
    moduleId: string;
    moduleName: string;
    date: string;
    status: AttendanceStatus;
    markedAt: string;
};
export declare class AttendanceService {
    private readonly attendanceModel;
    private readonly studentModel;
    private readonly moduleModel;
    constructor(attendanceModel: Model<AttendanceDocument>, studentModel: Model<Student>, moduleModel: Model<SchoolModuleDocument>);
    create(dto: CreateAttendanceDto): Promise<AttendanceDocument>;
    scanQr(dto: ScanAttendanceDto): Promise<{
        success: true;
        message: string;
        attendance: AttendanceDocument;
    }>;
    findAll(): Promise<AttendanceDocument[]>;
    findOne(id: string): Promise<AttendanceDocument>;
    update(id: string, dto: UpdateAttendanceDto): Promise<AttendanceDocument>;
    remove(id: string): Promise<void>;
    findByStudent(studentId: string): Promise<AttendanceDocument[]>;
    getReport(query: AttendanceReportQueryDto): Promise<{
        filters: {
            studentId: string | null;
            moduleId: string | null;
            batch: string | null;
            from: string | null;
            to: string | null;
            date: string | null;
        };
        summary: {
            totalStudents: number;
            totalRecords: number;
            present: number;
            absent: number;
        };
        students: {
            id: string;
            studentId: string;
            name: string | undefined;
            batch: string;
            modules: string[];
            attendance: AttendanceReportItem[];
        }[];
    }>;
    private buildDateFilter;
    private normalizeSessionDate;
    private ensureUniqueAttendanceSession;
    private assertDateString;
    private mapAttendanceRecord;
}
export {};
