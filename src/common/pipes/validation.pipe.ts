import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { ValidationErrorDetail } from '../interfaces/api-response.interface';
import { ValidationException } from '../exceptions';

@Injectable()
export class CustomValidationPipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    if (value === null || value === undefined || value === '') {
      throw new ValidationException('No data submitted', [
        { field: 'general', message: 'No data submitted' },
      ] as any);
    }

    const { metatype } = metadata;
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    const object = plainToInstance(metatype, value);
    const errors = await validate(object);

    if (errors.length > 0) {
      const validationErrors: ValidationErrorDetail[] = errors.map(
        (error) => ({
          field: error.property,
          message: Object.values(error.constraints || {}) as string[],
          value: error.value,
        }),
      );

      throw new ValidationException('Validation failed', validationErrors as any);
    }

    return object;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
