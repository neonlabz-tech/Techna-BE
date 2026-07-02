import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { PaymentTrackingQueryDto } from './dto/payment-tracking-query.dto';
export declare class PaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
    findAll(): Promise<{
        success: boolean;
        payments: any[];
    }>;
    findByStudent(studentId: string, req: any): Promise<{
        success: boolean;
        payments: any[];
    }>;
    tracking(studentId: string, query: PaymentTrackingQueryDto, req: any): Promise<{
        paidMonths: string[];
        pendingMonths: string[];
        payments: {
            id: any;
            studentId: any;
            studentCode: any;
            studentName: any;
            moduleId: any;
            moduleName: any;
            amount: any;
            paidDate: any;
            method: any;
            status: any;
            receiptNo: any;
            batch: any;
            notes: any;
            createdAt: any;
            updatedAt: any;
        }[];
        moduleId?: string | undefined;
        success: boolean;
        studentId: string;
        year: number;
    }>;
    create(body: CreatePaymentDto): Promise<{
        success: boolean;
        payment: {
            id: any;
            studentId: any;
            studentCode: any;
            studentName: any;
            moduleId: any;
            moduleName: any;
            amount: any;
            paidDate: any;
            method: any;
            status: any;
            receiptNo: any;
            batch: any;
            notes: any;
            createdAt: any;
            updatedAt: any;
        };
    }>;
    update(id: string, dto: UpdatePaymentDto): Promise<{
        success: boolean;
        payment: {
            id: any;
            studentId: any;
            studentCode: any;
            studentName: any;
            moduleId: any;
            moduleName: any;
            amount: any;
            paidDate: any;
            method: any;
            status: any;
            receiptNo: any;
            batch: any;
            notes: any;
            createdAt: any;
            updatedAt: any;
        };
    }>;
}
