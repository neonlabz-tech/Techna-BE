import { CallHandler, ExecutionContext } from '@nestjs/common';
import { lastValueFrom, of } from 'rxjs';
import { ResponseInterceptor } from './response.interceptor';

describe('ResponseInterceptor', () => {
  const interceptor = new ResponseInterceptor();

  it('should wrap raw data in the API response format', async () => {
    const response = { statusCode: 200 } as any;
    const request = { method: 'GET', url: '/modules' } as any;
    const context = {
      switchToHttp: () => ({
        getResponse: () => response,
        getRequest: () => request,
      }),
    } as ExecutionContext;
    const callHandler = {
      handle: () => of([{ id: '1' }]),
    } as CallHandler;

    const result = await lastValueFrom(interceptor.intercept(context, callHandler));

    expect(result).toMatchObject({
      success: true,
      message: 'Data retrieved successfully',
      data: [{ id: '1' }],
      path: '/modules',
    });
  });

  it('should leave already formatted responses untouched', async () => {
    const response = { statusCode: 200 } as any;
    const request = { method: 'GET', url: '/modules' } as any;
    const existingResponse = {
      success: true,
      message: 'Already formatted',
      data: [{ id: '1' }],
      timestamp: new Date().toISOString(),
    };
    const context = {
      switchToHttp: () => ({
        getResponse: () => response,
        getRequest: () => request,
      }),
    } as ExecutionContext;
    const callHandler = {
      handle: () => of(existingResponse),
    } as CallHandler;

    const result = await lastValueFrom(interceptor.intercept(context, callHandler));

    expect(result).toBe(existingResponse);
  });
});