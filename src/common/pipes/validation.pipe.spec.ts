import { BadRequestException } from '@nestjs/common';
import { CustomValidationPipe } from './validation.pipe';
import { ValidationException } from '../exceptions';
import { CreateAttendanceDto } from '../../attendance/dto/create-attendance.dto';

describe('CustomValidationPipe', () => {
  const pipe = new CustomValidationPipe();

  it('should return a transformed DTO instance for valid input', async () => {
    const payload = {
      studentId: 'student-1',
      moduleId: 'module-1',
      moduleName: 'Mathematics',
      date: '2026-06-04T00:00:00.000Z',
      status: 'present',
      markedAt: '2026-06-04T10:00:00.000Z',
    };

    const result = await pipe.transform(payload, {
      metatype: CreateAttendanceDto,
    } as any);

    expect(result).toBeInstanceOf(CreateAttendanceDto);
    expect(result).not.toBe(payload);
    expect(result.studentId).toBe('student-1');
  });

  it('should reject empty payloads', async () => {
    await expect(
      pipe.transform(null as any, { metatype: CreateAttendanceDto } as any),
    ).rejects.toBeInstanceOf(ValidationException);
  });

  it('should include validation errors for invalid input', async () => {
    await expect(
      pipe.transform(
        {
          studentId: '',
          moduleId: 'module-1',
          moduleName: 'Mathematics',
          date: 'not-a-date',
          status: 'present',
          markedAt: 'not-a-date',
        },
        { metatype: CreateAttendanceDto } as any,
      ),
    ).rejects.toMatchObject({
      message: 'Validation failed',
      validationErrors: expect.arrayContaining([
        expect.objectContaining({ field: 'studentId' }),
      ]),
    });
  });
});