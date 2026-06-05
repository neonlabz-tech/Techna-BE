import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrorResponse, ValidationErrorDetail } from '../interfaces/api-response.interface';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    const message = this.normalizeMessage(exceptionResponse, exception.message);
    const validationErrors = this.extractValidationErrors(
      exceptionResponse,
      exception,
    );

    const errorResponse: ErrorResponse = {
      success: false,
      message: typeof message === 'string' ? message : 'An error occurred',
      timestamp: new Date().toISOString(),
      path: request.url,
      error: {
        code: this.getErrorCode(status),
        statusCode: status,
        details: validationErrors && validationErrors.length > 0 ? validationErrors : undefined,
      },
    };

    // Log error
    this.logger.error(
      `${request.method} ${request.url} - ${status} - ${message}`,
      exception.stack,
    );

    response.status(status).json(errorResponse);
  }

  private normalizeMessage(
    exceptionResponse: unknown,
    fallback: string,
  ): string | string[] {
    if (exceptionResponse && typeof exceptionResponse === 'object' && 'message' in exceptionResponse) {
      return (exceptionResponse as any).message;
    }

    return fallback;
  }

  private extractValidationErrors(
    exceptionResponse: unknown,
    exception: HttpException,
  ): ValidationErrorDetail[] {
    if (!exceptionResponse || typeof exceptionResponse !== 'object') {
      return this.extractValidationErrorsFromMessage(exception.message);
    }

    const resp: any = exceptionResponse;

    if (resp.error && Array.isArray(resp.error.details)) {
      return resp.error.details;
    }

    if (Array.isArray(resp.details)) {
      return resp.details;
    }

    const detailsFromMessage = this.extractValidationErrorsFromMessage(resp.message);
    if (detailsFromMessage.length > 0) {
      return detailsFromMessage;
    }

    const exAny = exception as any;
    if (Array.isArray(exAny.validationErrors)) {
      return exAny.validationErrors;
    }

    if (Array.isArray(exAny.details)) {
      return exAny.details;
    }

    return [];
  }

  private extractValidationErrorsFromMessage(
    message: string | string[] | undefined,
  ): ValidationErrorDetail[] {
    if (!message) {
      return [];
    }

    if (Array.isArray(message)) {
      return message.map((msg, index) => ({
        field: `field_${index}`,
        message: msg,
      }));
    }

    return [{ field: 'general', message }];
  }

  private getErrorCode(status: number): string {
    const errorCodeMap: Record<number, string> = {
      [HttpStatus.BAD_REQUEST]: 'BAD_REQUEST',
      [HttpStatus.UNAUTHORIZED]: 'UNAUTHORIZED',
      [HttpStatus.FORBIDDEN]: 'FORBIDDEN',
      [HttpStatus.NOT_FOUND]: 'NOT_FOUND',
      [HttpStatus.CONFLICT]: 'CONFLICT',
      [HttpStatus.INTERNAL_SERVER_ERROR]: 'INTERNAL_SERVER_ERROR',
      [HttpStatus.SERVICE_UNAVAILABLE]: 'SERVICE_UNAVAILABLE',
    };

    return errorCodeMap[status] || 'ERROR';
  }
}
