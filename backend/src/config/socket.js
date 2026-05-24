const { Server } = require('socket.io');
const logger = require('../utils/logger');

let io = null;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
      credentials: true,
    },
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  io.on('connection', (socket) => {
    logger.info(`✅ Socket connected: ${socket.id}`);

    // Join user to their personal room
    socket.on('join', (userId) => {
      socket.join(`user:${userId}`);
      logger.info(`User ${userId} joined personal room`);
    });

    // Join event room
    socket.on('join:event', (eventId) => {
      socket.join(`event:${eventId}`);
      logger.info(`Socket ${socket.id} joined event:${eventId}`);
    });

    // Leave event room
    socket.on('leave:event', (eventId) => {
      socket.leave(`event:${eventId}`);
      logger.info(`Socket ${socket.id} left event:${eventId}`);
    });

    // Chat message
    socket.on('chat:message', (data) => {
      io.to(`event:${data.eventId}`).emit('chat:message', data);
    });

    // Typing indicator
    socket.on('chat:typing', (data) => {
      socket.to(`event:${data.eventId}`).emit('chat:typing', data);
    });

    // New media posted
    socket.on('feed:new-media', (data) => {
      io.to(`event:${data.eventId}`).emit('feed:new-media', data);
    });

    // RSVP update
    socket.on('event:rsvp', (data) => {
      io.to(`event:${data.eventId}`).emit('event:rsvp', data);
    });

    socket.on('disconnect', () => {
      logger.info(`Socket disconnected: ${socket.id}`);
    });
  });

  logger.info('✅ Socket.IO initialized');
  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error('Socket.IO not initialized. Call initSocket() first.');
  }
  return io;
};

module.exports = { initSocket, getIO };
