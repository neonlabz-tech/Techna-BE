"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalServerErrorException = exports.ConflictException = exports.ForbiddenException = exports.UnauthorizedException = exports.NotFoundException = exports.ValidationException = exports.BadRequestException = exports.CustomException = void 0;
const common_1 = require("@nestjs/common");
class CustomException extends common_1.HttpException {
    constructor(message, statusCode = common_1.HttpStatus.INTERNAL_SERVER_ERROR, details) {
        const response = typeof message === 'object'
            ? message
            : {
                message,
                error: details ? { details } : undefined,
            };
        super(response, statusCode);
        this.details = details;
    }
}
exports.CustomException = CustomException;
class BadRequestException extends CustomException {
    constructor(message, details) {
        super(message, common_1.HttpStatus.BAD_REQUEST, details);
    }
}
exports.BadRequestException = BadRequestException;
class ValidationException extends CustomException {
    constructor(message, validationErrors) {
        super(message, common_1.HttpStatus.BAD_REQUEST, validationErrors);
        this.validationErrors = validationErrors;
    }
}
exports.ValidationException = ValidationException;
class NotFoundException extends CustomException {
    constructor(message) {
        super(message, common_1.HttpStatus.NOT_FOUND);
    }
}
exports.NotFoundException = NotFoundException;
class UnauthorizedException extends CustomException {
    constructor(message = 'Unauthorized') {
        super(message, common_1.HttpStatus.UNAUTHORIZED);
    }
}
exports.UnauthorizedException = UnauthorizedException;
class ForbiddenException extends CustomException {
    constructor(message = 'Forbidden') {
        super(message, common_1.HttpStatus.FORBIDDEN);
    }
}
exports.ForbiddenException = ForbiddenException;
class ConflictException extends CustomException {
    constructor(message) {
        super(message, common_1.HttpStatus.CONFLICT);
    }
}
exports.ConflictException = ConflictException;
class InternalServerErrorException extends CustomException {
    constructor(message = 'Internal Server Error') {
        super(message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
exports.InternalServerErrorException = InternalServerErrorException;
//# sourceMappingURL=custom-exception.js.map