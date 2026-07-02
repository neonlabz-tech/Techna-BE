export declare class EnrolmentHistoryDto {
    studentId: string;
    studentCode: string;
    name: string;
    email: string;
    phone: string;
    modules: string[];
    batch: string;
    status: 'pending' | 'approved' | 'rejected';
    enrolledAt: string;
    approvedAt: string | null;
    rejectionReason?: string;
}
