require('dotenv').config();

const http = require('http');
const app = require('./app');
const { initSocket } = require('./config/socket');
const connectDB = require('./config/database');
const connectRedis = require('./config/redis');
const logger = require('./utils/logger');

const PORT = process.env.PORT || 5000;

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
initSocket(server);

// Database connection
connectDB();

// Redis connection
connectRedis();

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Rejection:', err);
  server.close(() => process.exit(1));
});

// Start server
server.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});

module.exports = server;
