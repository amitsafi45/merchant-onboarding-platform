import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { HttpException, HttpStatus, Logger } from '@nestjs/common';
import { SocketService } from './service/socket.service';
import { isUUID } from 'class-validator';

@WebSocketGateway({
  cors: {
    // Allow all origins for development purposes. In production, specify allowed origins.
    origin: '*',
  },
})
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(SocketGateway.name);

  constructor(private socketService: SocketService) {}

  afterInit(server: Server) {
    this.socketService.setServer(server);
    this.logger.log('WebSocket server initialized');
  }

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (!isUUID(userId)) {
      throw new HttpException('User id should be uuid', HttpStatus.BAD_REQUEST);
    }
    if (userId) client.join(userId);
    this.logger.log(`Client connected: ${userId || client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }
}
