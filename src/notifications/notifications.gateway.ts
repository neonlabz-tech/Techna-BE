import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

/**
 * WebSocket Gateway — STUDENT ONLY
 *
 * Only students can connect. After login, the frontend connects
 * with the JWT token and automatically receives real-time notifications.
 */
@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
  namespace: '/notifications',
})
export class NotificationsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(NotificationsGateway.name);

  /** Map: studentId → Set of socket IDs */
  private connectedStudents = new Map<string, Set<string>>();

  /** Callback for student login — set by NotificationsAutoService */
  private onStudentLoginCallback?: (studentId: string) => void;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  afterInit() {
    this.logger.log('Notifications WebSocket Gateway initialized (student-only)');
  }

  /**
   * Register a callback for when a student connects.
   */
  registerStudentLoginHandler(handler: (studentId: string) => void) {
    this.onStudentLoginCallback = handler;
  }

  /**
   * Handle new socket connection.
   * Only students with valid JWT are allowed.
   */
  async handleConnection(client: Socket) {
    try {
      const token = this.extractToken(client);

      if (!token) {
        client.disconnect();
        return;
      }

      const payload = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET', 'secret'),
      });

      if (!payload.sub || !payload.role) {
        client.disconnect();
        return;
      }

      // Only allow STUDENTS to connect
      if (payload.role !== 'student') {
        this.logger.warn(`Non-student (${payload.role}) tried to connect — rejected`);
        client.disconnect();
        return;
      }

      // Attach student data to socket
      (client as any).userId = payload.sub;
      (client as any).userRole = payload.role;

      // Join personal room
      client.join(`user:${payload.sub}`);

      // Track connection — trigger login notification on first connection
      const isFirstConnection = !this.connectedStudents.has(payload.sub);

      if (!this.connectedStudents.has(payload.sub)) {
        this.connectedStudents.set(payload.sub, new Set());
      }
      this.connectedStudents.get(payload.sub)!.add(client.id);

      // Auto-trigger login notification
      if (isFirstConnection && this.onStudentLoginCallback) {
        this.onStudentLoginCallback(payload.sub);
      }

      this.logger.log(`Student connected: ${client.id} | ID: ${payload.sub}`);
    } catch {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const userId = (client as any).userId;

    if (userId && this.connectedStudents.has(userId)) {
      this.connectedStudents.get(userId)!.delete(client.id);
      if (this.connectedStudents.get(userId)!.size === 0) {
        this.connectedStudents.delete(userId);
      }
    }
  }

  /**
   * Student joins their batch room for batch-specific notifications.
   */
  @SubscribeMessage('join-batch')
  handleJoinBatch(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { batch: string },
  ) {
    if (data?.batch) {
      client.join(`batch:${data.batch}`);
    }
  }

  /**
   * Student joins a module room for module-specific notifications.
   */
  @SubscribeMessage('join-module')
  handleJoinModule(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { moduleId: string },
  ) {
    if (data?.moduleId) {
      client.join(`module:${data.moduleId}`);
    }
  }

  // ─── Emit Methods (called internally by NotificationsService) ──────────────

  /** Send to all connected students */
  sendToAll(notification: any) {
    for (const [studentId] of this.connectedStudents) {
      this.server.to(`user:${studentId}`).emit('notification', notification);
    }
  }

  /** Send to a specific student */
  sendToStudent(studentId: string, notification: any) {
    this.server.to(`user:${studentId}`).emit('notification', notification);
  }

  /** Send to all students in a batch */
  sendToBatch(batch: string, notification: any) {
    this.server.to(`batch:${batch}`).emit('notification', notification);
  }

  /** Send to all students in a module */
  sendToModule(moduleId: string, notification: any) {
    this.server.to(`module:${moduleId}`).emit('notification', notification);
  }

  /** Get connected student count */
  getConnectedStudentCount(): number {
    return this.connectedStudents.size;
  }

  // ─── Private ──────────────────────────────────────────────────────────────────

  private extractToken(client: Socket): string | null {
    const authToken =
      (client.handshake.auth as any)?.token ||
      (client.handshake.headers as any)?.authorization;

    if (authToken) {
      return authToken.replace('Bearer ', '');
    }

    const queryToken = client.handshake.query?.token;
    if (queryToken && typeof queryToken === 'string') {
      return queryToken.replace('Bearer ', '');
    }

    return null;
  }
}
