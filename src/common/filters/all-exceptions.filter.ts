import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrorResponse } from '../interfaces/api-response.interface';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    if (exception instanceof HttpException) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      const request = ctx.getRequest<Request>();
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      const message = this.normalizeMessage(exceptionResponse, exception.message);
      const details = this.extractValidationErrors(exceptionResponse, exception);

      const errorResponse: ErrorResponse = {
        success: false,
        message: typeof message === 'string' ? message : 'An error occurred',
        timestamp: new Date().toISOString(),
        path: request.url,
        error: {
          code: this.getErrorCode(status),
          statusCode: status,
          details: details.length > 0 ? details : undefined,
        },
      };

      response.status(status).json(errorResponse);
      return;
    }

    // Handle non-HTTP exceptions
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = HttpStatus.INTERNAL_SERVER_ERROR;
    const message =
      exception instanceof Error
        ? exception.message
        : 'An unexpected error occurred';

    const errorResponse: ErrorResponse = {
      success: false,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        statusCode: status,
      },
    };

    this.logger.error(
      `Unhandled Exception: ${message}`,
      exception instanceof Error ? exception.stack : String(exception),
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
  ): any[] {
    if (!exceptionResponse || typeof exceptionResponse !== 'object') {
      return [];
    }

    const resp: any = exceptionResponse;

    if (resp.error && Array.isArray(resp.error.details)) {
      return resp.error.details;
    }

    if (Array.isArray(resp.details)) {
      return resp.details;
    }

    const exAny = exception as any;
    if (Array.isArray(exAny.validationErrors)) {
      return exAny.validationErrors;
    }

    if (Array.isArray(exAny.details)) {
      return exAny.details;
    }

    if (Array.isArray(resp.message)) {
      return resp.message.map((msg: string, index: number) => ({
        field: `field_${index}`,
        message: msg,
      }));
    }

    return [];
  }

  private getErrorCode(status: number): string {
    const errorCodeMap: Record<number, string> = {
      [HttpStatus.BAD_REQUEST]: 'BAD_REQUEST',
      [HttpStatus.UNAUTHORIZED]: 'UNAUTHORIZED',
      [HttpStatus.FORBIDDEN]: 'FORBIDDEN',
      [HttpStatus.NOT_FOUND]: 'NOT_FOUND',
      [HttpStatus.CONFLICT]: 'CONFLICT',
      [HttpStatus.INTERNAL_SERVER_ERROR]: 'INTERNAL_SERVER_ERROR',
    };
    return errorCodeMap[status] || 'UNKNOWN_ERROR';
  }
}
