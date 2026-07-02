import { HttpException, HttpStatus } from '@nestjs/common';
export declare class CustomException extends HttpException {
    readonly details?: any | undefined;
    constructor(message: string, statusCode?: HttpStatus, details?: any | undefined);
}
export declare class BadRequestException extends CustomException {
    constructor(message: string, details?: any);
}
export declare class ValidationException extends CustomException {
    readonly validationErrors: any[];
    constructor(message: string, validationErrors: any[]);
}
export declare class NotFoundException extends CustomException {
    constructor(message: string);
}
export declare class UnauthorizedException extends CustomException {
    constructor(message?: string);
}
export declare class ForbiddenException extends CustomException {
    constructor(message?: string);
}
export declare class ConflictException extends CustomException {
    constructor(message: string);
}
export declare class InternalServerErrorException extends CustomException {
    constructor(message?: string);
}
