"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEnvironment = validateEnvironment;
function validateEnvironment(environment) {
    if (!environment.PORT) {
        environment.PORT = '4000';
    }
    if (!environment.MONGO_URI) {
        throw new Error('MONGO_URI is required');
    }
    if (!environment.GMAIL_USER) {
        throw new Error('GMAIL_USER is required');
    }
    if (!environment.GMAIL_APP_PASSWORD) {
        throw new Error('GMAIL_APP_PASSWORD is required');
    }
    return environment;
}
//# sourceMappingURL=env.validation.js.map