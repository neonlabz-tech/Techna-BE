"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var NotificationsGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const common_1 = require("@nestjs/common");
const socket_io_1 = require("socket.io");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
let NotificationsGateway = NotificationsGateway_1 = class NotificationsGateway {
    constructor(jwtService, configService) {
        this.jwtService = jwtService;
        this.configService = configService;
        this.logger = new common_1.Logger(NotificationsGateway_1.name);
        this.connectedStudents = new Map();
    }
    afterInit() {
        this.logger.log('Notifications WebSocket Gateway initialized (student-only)');
    }
    registerStudentLoginHandler(handler) {
        this.onStudentLoginCallback = handler;
    }
    async handleConnection(client) {
        try {
            const token = this.extractToken(client);
            if (!token) {
                client.disconnect();
                return;
            }
            const payload = this.jwtService.verify(token, {
                secret: this.configService.get('JWT_SECRET', 'secret'),
            });
            if (!payload.sub || !payload.role) {
                client.disconnect();
                return;
            }
            if (payload.role !== 'student') {
                this.logger.warn(`Non-student (${payload.role}) tried to connect — rejected`);
                client.disconnect();
                return;
            }
            client.userId = payload.sub;
            client.userRole = payload.role;
            client.join(`user:${payload.sub}`);
            const isFirstConnection = !this.connectedStudents.has(payload.sub);
            if (!this.connectedStudents.has(payload.sub)) {
                this.connectedStudents.set(payload.sub, new Set());
            }
            this.connectedStudents.get(payload.sub).add(client.id);
            if (isFirstConnection && this.onStudentLoginCallback) {
                this.onStudentLoginCallback(payload.sub);
            }
            this.logger.log(`Student connected: ${client.id} | ID: ${payload.sub}`);
        }
        catch {
            client.disconnect();
        }
    }
    handleDisconnect(client) {
        const userId = client.userId;
        if (userId && this.connectedStudents.has(userId)) {
            this.connectedStudents.get(userId).delete(client.id);
            if (this.connectedStudents.get(userId).size === 0) {
                this.connectedStudents.delete(userId);
            }
        }
    }
    handleJoinBatch(client, data) {
        if (data?.batch) {
            client.join(`batch:${data.batch}`);
        }
    }
    handleJoinModule(client, data) {
        if (data?.moduleId) {
            client.join(`module:${data.moduleId}`);
        }
    }
    sendToAll(notification) {
        for (const [studentId] of this.connectedStudents) {
            this.server.to(`user:${studentId}`).emit('notification', notification);
        }
    }
    sendToStudent(studentId, notification) {
        this.server.to(`user:${studentId}`).emit('notification', notification);
    }
    sendToBatch(batch, notification) {
        this.server.to(`batch:${batch}`).emit('notification', notification);
    }
    sendToModule(moduleId, notification) {
        this.server.to(`module:${moduleId}`).emit('notification', notification);
    }
    getConnectedStudentCount() {
        return this.connectedStudents.size;
    }
    extractToken(client) {
        const authToken = client.handshake.auth?.token ||
            client.handshake.headers?.authorization;
        if (authToken) {
            return authToken.replace('Bearer ', '');
        }
        const queryToken = client.handshake.query?.token;
        if (queryToken && typeof queryToken === 'string') {
            return queryToken.replace('Bearer ', '');
        }
        return null;
    }
};
exports.NotificationsGateway = NotificationsGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], NotificationsGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('join-batch'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], NotificationsGateway.prototype, "handleJoinBatch", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('join-module'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], NotificationsGateway.prototype, "handleJoinModule", null);
exports.NotificationsGateway = NotificationsGateway = NotificationsGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
            credentials: true,
        },
        namespace: '/notifications',
    }),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        config_1.ConfigService])
], NotificationsGateway);
//# sourceMappingURL=notifications.gateway.js.map