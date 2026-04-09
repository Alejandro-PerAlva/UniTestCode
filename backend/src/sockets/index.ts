/**
 * @module SocketIndex
 * Central registry for all Socket.IO namespaces and event handlers.
 */

import { Server, Socket } from 'socket.io';
import { setupRunHandler } from './runHandler.js';
import { setupDuelHandler } from './duelHandler.js';

/**
 * Initializes and binds all real-time communication modules to incoming client connections.
 * * @param io - The initialized Socket.IO server instance.
 */
export const setupSockets = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    setupRunHandler(socket);
    setupDuelHandler(socket);
  });
};