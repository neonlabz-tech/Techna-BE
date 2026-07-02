import { ArgumentsHost, ExceptionFilter, HttpException } from '@nestjs/common';
export declare class HttpExceptionFilter implements ExceptionFilter {
    private readonly logger;
    catch(exception: HttpException, host: ArgumentsHost): void;
    private normalizeMessage;
    private extractValidationErrors;
    private extractValidationErrorsFromMessage;
    private getErrorCode;
}
