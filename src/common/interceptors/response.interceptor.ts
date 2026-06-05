import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Request, Response } from 'express';
import { ApiResponse } from '../interfaces/api-response.interface';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    return next.handle().pipe(
      map((data) => {
        const statusCode = response.statusCode || HttpStatus.OK;
        
        // Check if data is already formatted as ApiResponse
        if (
          data &&
          typeof data === 'object' &&
          'success' in data &&
          'message' in data
        ) {
          return data;
        }

        // Determine success message based on HTTP method and status
        let message = 'Success';
        if (request.method === 'POST' && statusCode === HttpStatus.CREATED) {
          message = 'Resource created successfully';
        } else if (request.method === 'PUT' || request.method === 'PATCH') {
          message = 'Resource updated successfully';
        } else if (request.method === 'DELETE') {
          message = 'Resource deleted successfully';
        } else if (request.method === 'GET') {
          message = 'Data retrieved successfully';
        }

        const apiResponse: ApiResponse = {
          success: true,
          message,
          data,
          timestamp: new Date().toISOString(),
          path: request.url,
        };

        return apiResponse;
      }),
    );
  }
}
