import { ArgumentsHost, HttpStatus } from '@nestjs/common';
import { AllExceptionsFilter } from './all-exceptions.filter';

describe('AllExceptionsFilter', () => {
  const filter = new AllExceptionsFilter();

  it('should format unexpected errors as internal server errors', () => {
    const json = jest.fn();
    const status = jest.fn(() => ({ json }));
    const response = { status } as any;
    const request = { method: 'GET', url: '/attendance' } as any;
    const host = {
      switchToHttp: () => ({
        getResponse: () => response,
        getRequest: () => request,
      }),
    } as ArgumentsHost;

    filter.catch(new Error('Database down'), host);

    expect(status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: 'Database down',
        path: '/attendance',
        error: expect.objectContaining({
          code: 'INTERNAL_SERVER_ERROR',
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        }),
      }),
    );
  });
});