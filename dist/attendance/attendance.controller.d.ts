import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { ScanAttendanceDto } from './dto/scan-attendance.dto';
import { AttendanceReportQueryDto } from './dto/report-query.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { AttendanceDocument } from './schemas/attendance.schema';
export declare class AttendanceController {
    private readonly attendanceService;
    constructor(attendanceService: AttendanceService);
    scanQr(scanAttendanceDto: ScanAttendanceDto): Promise<{
        success: true;
        message: string;
        attendance: AttendanceDocument;
    }>;
    create(createAttendanceDto: CreateAttendanceDto): Promise<AttendanceDocument>;
    findAll(): Promise<AttendanceDocument[]>;
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
            attendance: {
                id: string;
                studentId: string;
                moduleId: string;
                moduleName: string;
                date: string;
                status: "present" | "absent";
                markedAt: string;
            }[];
        }[];
    }>;
    findByStudent(studentId: string, req: any): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/attendance.schema").Attendance, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/attendance.schema").Attendance & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    })[]>;
    findOne(id: string): Promise<AttendanceDocument>;
    update(id: string, updateAttendanceDto: UpdateAttendanceDto): Promise<AttendanceDocument>;
    remove(id: string): Promise<void>;
}
