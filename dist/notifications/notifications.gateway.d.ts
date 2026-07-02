import { OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
export declare class NotificationsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private readonly jwtService;
    private readonly configService;
    server: Server;
    private readonly logger;
    private connectedStudents;
    private onStudentLoginCallback?;
    constructor(jwtService: JwtService, configService: ConfigService);
    afterInit(): void;
    registerStudentLoginHandler(handler: (studentId: string) => void): void;
    handleConnection(client: Socket): Promise<void>;
    handleDisconnect(client: Socket): void;
    handleJoinBatch(client: Socket, data: {
        batch: string;
    }): void;
    handleJoinModule(client: Socket, data: {
        moduleId: string;
    }): void;
    sendToAll(notification: any): void;
    sendToStudent(studentId: string, notification: any): void;
    sendToBatch(batch: string, notification: any): void;
    sendToModule(moduleId: string, notification: any): void;
    getConnectedStudentCount(): number;
    private extractToken;
}
