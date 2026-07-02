import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    getSummary(): Promise<{
        totalStudents: number;
        totalTeachers: number;
        totalModules: number;
        totalRevenue: any;
        paidRevenue: any;
        totalPaid: any;
        paidPayments: {
            count: any;
            amount: any;
        };
        todayAttendance: {
            date: string;
            present: number;
            absent: number;
            total: number;
        };
        pendingPayments: {
            count: any;
            amount: any;
        };
    }>;
    getRevenue(): Promise<{
        totalRevenue: any;
    }>;
}
