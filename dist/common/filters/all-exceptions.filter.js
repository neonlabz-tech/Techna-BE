"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var AllExceptionsFilter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllExceptionsFilter = void 0;
const common_1 = require("@nestjs/common");
let AllExceptionsFilter = AllExceptionsFilter_1 = class AllExceptionsFilter {
    constructor() {
        this.logger = new common_1.Logger(AllExceptionsFilter_1.name);
    }
    catch(exception, host) {
        if (exception instanceof common_1.HttpException) {
            const ctx = host.switchToHttp();
            const response = ctx.getResponse();
            const request = ctx.getRequest();
            const status = exception.getStatus();
            const exceptionResponse = exception.getResponse();
            const message = this.normalizeMessage(exceptionResponse, exception.message);
            const details = this.extractValidationErrors(exceptionResponse, exception);
            const errorResponse = {
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
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const status = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        const message = exception instanceof Error
            ? exception.message
            : 'An unexpected error occurred';
        const errorResponse = {
            success: false,
            message,
            timestamp: new Date().toISOString(),
            path: request.url,
            error: {
                code: 'INTERNAL_SERVER_ERROR',
                statusCode: status,
            },
        };
        this.logger.error(`Unhandled Exception: ${message}`, exception instanceof Error ? exception.stack : String(exception));
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
            return [];
        }
        const resp = exceptionResponse;
        if (resp.error && Array.isArray(resp.error.details)) {
            return resp.error.details;
        }
        if (Array.isArray(resp.details)) {
            return resp.details;
        }
        const exAny = exception;
        if (Array.isArray(exAny.validationErrors)) {
            return exAny.validationErrors;
        }
        if (Array.isArray(exAny.details)) {
            return exAny.details;
        }
        if (Array.isArray(resp.message)) {
            return resp.message.map((msg, index) => ({
                field: `field_${index}`,
                message: msg,
            }));
        }
        return [];
    }
    getErrorCode(status) {
        const errorCodeMap = {
            [common_1.HttpStatus.BAD_REQUEST]: 'BAD_REQUEST',
            [common_1.HttpStatus.UNAUTHORIZED]: 'UNAUTHORIZED',
            [common_1.HttpStatus.FORBIDDEN]: 'FORBIDDEN',
            [common_1.HttpStatus.NOT_FOUND]: 'NOT_FOUND',
            [common_1.HttpStatus.CONFLICT]: 'CONFLICT',
            [common_1.HttpStatus.INTERNAL_SERVER_ERROR]: 'INTERNAL_SERVER_ERROR',
        };
        return errorCodeMap[status] || 'UNKNOWN_ERROR';
    }
};
exports.AllExceptionsFilter = AllExceptionsFilter;
exports.AllExceptionsFilter = AllExceptionsFilter = AllExceptionsFilter_1 = __decorate([
    (0, common_1.Catch)()
], AllExceptionsFilter);
//# sourceMappingURL=all-exceptions.filter.js.map