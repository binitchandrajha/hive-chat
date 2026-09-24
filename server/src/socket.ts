import type { Server as HttpServer } from 'node:http';
import { Server } from 'socket.io';
import { env } from './config/env.js';
import type { ClientToServerEvents, ServerToClientEvents } from './types/chat.js';

export type HiveServer = Server<ClientToServerEvents, ServerToClientEvents>;

export function createSocketServer(httpServer: HttpServer): HiveServer {
  const io: HiveServer = new Server(httpServer, { cors: { origin: env.CORS_ORIGIN } });

  io.on('connection', (socket) => {
    console.log('[socket] connected:', socket.id);

    socket.on('message', (payload) => {
      io.emit('message', {
        ...payload,
        id: `${socket.id}${Date.now()}`,
        at: new Date().toISOString(),
      });
    });

    socket.on('disconnect', () => console.log('[socket] disconnected:', socket.id));
  });

  return io;
}
