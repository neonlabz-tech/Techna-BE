export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
    timestamp: string;
    path?: string;
}
export interface PaginatedResponse<T = any> extends ApiResponse<T> {
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
}
export interface ValidationErrorDetail {
    field: string;
    message: string | string[];
    value?: any;
}
export interface ErrorResponse extends ApiResponse {
    error?: {
        code: string;
        details?: ValidationErrorDetail[];
        statusCode: number;
    };
}
