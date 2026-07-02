"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var HttpExceptionFilter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
let HttpExceptionFilter = HttpExceptionFilter_1 = class HttpExceptionFilter {
    constructor() {
        this.logger = new common_1.Logger(HttpExceptionFilter_1.name);
    }
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const status = exception.getStatus();
        const exceptionResponse = exception.getResponse();
        const message = this.normalizeMessage(exceptionResponse, exception.message);
        const validationErrors = this.extractValidationErrors(exceptionResponse, exception);
        const errorResponse = {
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
        this.logger.error(`${request.method} ${request.url} - ${status} - ${message}`, exception.stack);
        response.status(status).json(errorResponse);
    }
    normalizeMessage(exceptionResponse, fallback) {
        if (exceptionResponse && typeof exceptionResponse === 'object' && 'message' in exceptionResponse) {
            return exceptionResponse.message;
        }
        return fallback;
    }
    extractValidationErrors(exceptionResponse, exception) {
        if (!exceptionResponse || typeof exceptionResponse !== 'object') {
            return this.extractValidationErrorsFromMessage(exception.message);
        }
        const resp = exceptionResponse;
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
        const exAny = exception;
        if (Array.isArray(exAny.validationErrors)) {
            return exAny.validationErrors;
        }
        if (Array.isArray(exAny.details)) {
            return exAny.details;
        }
        return [];
    }
    extractValidationErrorsFromMessage(message) {
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
    getErrorCode(status) {
        const errorCodeMap = {
            [common_1.HttpStatus.BAD_REQUEST]: 'BAD_REQUEST',
            [common_1.HttpStatus.UNAUTHORIZED]: 'UNAUTHORIZED',
            [common_1.HttpStatus.FORBIDDEN]: 'FORBIDDEN',
            [common_1.HttpStatus.NOT_FOUND]: 'NOT_FOUND',
            [common_1.HttpStatus.CONFLICT]: 'CONFLICT',
            [common_1.HttpStatus.INTERNAL_SERVER_ERROR]: 'INTERNAL_SERVER_ERROR',
            [common_1.HttpStatus.SERVICE_UNAVAILABLE]: 'SERVICE_UNAVAILABLE',
        };
        return errorCodeMap[status] || 'ERROR';
    }
};
exports.HttpExceptionFilter = HttpExceptionFilter;
exports.HttpExceptionFilter = HttpExceptionFilter = HttpExceptionFilter_1 = __decorate([
    (0, common_1.Catch)(common_1.HttpException)
], HttpExceptionFilter);
//# sourceMappingURL=http-exception.filter.js.map