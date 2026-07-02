export declare class ScanAttendanceDto {
    readonly qrToken: string;
    readonly moduleId: string;
    readonly moduleName: string;
    readonly status?: 'present' | 'absent';
    readonly date?: string;
    readonly markedAt?: string;
}
