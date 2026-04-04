import { Server, Socket } from 'socket.io';
import { setupRunHandler } from './runHandler.js';
import { setupDuelHandler } from './duelHandler.js';

export const setupSockets = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    setupRunHandler(socket);
    setupDuelHandler(socket);
  });
};