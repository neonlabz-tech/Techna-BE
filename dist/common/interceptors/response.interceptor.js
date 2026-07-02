"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
let ResponseInterceptor = class ResponseInterceptor {
    intercept(context, next) {
        const ctx = context.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        return next.handle().pipe((0, operators_1.map)((data) => {
            const statusCode = response.statusCode || common_1.HttpStatus.OK;
            if (data &&
                typeof data === 'object' &&
                'success' in data &&
                'message' in data) {
                return data;
            }
            let message = 'Success';
            if (request.method === 'POST' && statusCode === common_1.HttpStatus.CREATED) {
                message = 'Resource created successfully';
            }
            else if (request.method === 'PUT' || request.method === 'PATCH') {
                message = 'Resource updated successfully';
            }
            else if (request.method === 'DELETE') {
                message = 'Resource deleted successfully';
            }
            else if (request.method === 'GET') {
                message = 'Data retrieved successfully';
            }
            const apiResponse = {
                success: true,
                message,
                data,
                timestamp: new Date().toISOString(),
                path: request.url,
            };
            return apiResponse;
        }));
    }
};
exports.ResponseInterceptor = ResponseInterceptor;
exports.ResponseInterceptor = ResponseInterceptor = __decorate([
    (0, common_1.Injectable)()
], ResponseInterceptor);
//# sourceMappingURL=response.interceptor.js.map