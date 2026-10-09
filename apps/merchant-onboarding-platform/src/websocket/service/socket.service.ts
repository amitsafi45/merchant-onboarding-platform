import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';

@Injectable()
export class SocketService {
  private server!: Server;

  setServer(server: Server) {
    this.server = server;
  }

  emitToUser<T>(userId: string, event: string, data: T): void {
    if (!this.server) {
      console.warn('Socket server not ready');
      return;
    }

    this.server.to(userId).emit(event, data);
  }
}
