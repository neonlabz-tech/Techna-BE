import { ArgumentsHost, HttpStatus } from '@nestjs/common';
import { HttpExceptionFilter } from './http-exception.filter';
import { ValidationException } from '../exceptions';

describe('HttpExceptionFilter', () => {
  const filter = new HttpExceptionFilter();

  it('should format validation exceptions with details', () => {
    const json = jest.fn();
    const status = jest.fn(() => ({ json }));
    const response = { status } as any;
    const request = { method: 'POST', url: '/teachers' } as any;
    const host = {
      switchToHttp: () => ({
        getResponse: () => response,
        getRequest: () => request,
      }),
    } as ArgumentsHost;

    filter.catch(
      new ValidationException('Validation failed', [
        { field: 'email', message: 'Email is required' },
      ]),
      host,
    );

    expect(status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: 'Validation failed',
        path: '/teachers',
        error: expect.objectContaining({
          code: 'BAD_REQUEST',
          statusCode: HttpStatus.BAD_REQUEST,
          details: [
            expect.objectContaining({
              field: 'email',
              message: 'Email is required',
            }),
          ],
        }),
      }),
    );
  });
});