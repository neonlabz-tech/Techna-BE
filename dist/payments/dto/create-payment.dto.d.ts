export declare class CreatePaymentDto {
    studentId: string;
    studentName?: string;
    moduleId: string;
    moduleName?: string;
    amount: number;
    paidDate: string;
    method: 'cash' | 'bank' | 'online';
    status?: 'paid' | 'pending' | 'overdue';
    receiptNo?: string;
    batch: string;
    notes?: string;
}
