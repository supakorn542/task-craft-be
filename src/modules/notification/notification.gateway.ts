import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import * as cookie from 'cookie';
import { NotificationResponseDto } from './dto/notification.dto';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
})
@Injectable()
export class NotificationGateWay
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  private userSockets = new Map<string, string>();

  constructor(private jwtService: JwtService) {}

  async handleConnection(client: Socket) {
    try {
     let token = client.handshake.auth?.token;

      if (!token && client.handshake.headers.cookie) {
        const rawCookies = client.handshake.headers.cookie;
        const parsedCookies = cookie.parse(rawCookies);
        token = parsedCookies['AccessToken'];
      }

      if (!token) {
        client.disconnect();
        return;
      }

      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });

      const userId = payload.sub || payload.id || payload.userId;

      this.userSockets.set(userId, client.id);
    } catch (e) {
      console.error('Connection unauthorized');
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    for (const [userId, socketId] of this.userSockets.entries()) {
      if (socketId === client.id) {
        this.userSockets.delete(userId);
        break;
      }
    }
  }

  sendToUser(userId: string, event: string, data: NotificationResponseDto) {
    const socketId = this.userSockets.get(userId);
    if (socketId) {
      this.server.to(socketId).emit(event, data);
    }
  }
}
