const Redis = require('ioredis');
const logger = require('../utils/logger');

let redisClient = null;

const connectRedis = () => {
  try {
    redisClient = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379,
      password: process.env.REDIS_PASSWORD || undefined,
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
      maxRetriesPerRequest: 3,
    });

    redisClient.on('connect', () => {
      logger.info('✅ Redis Connected');
    });

    redisClient.on('error', (err) => {
      logger.error('❌ Redis connection error:', err.message);
    });

    redisClient.on('reconnecting', () => {
      logger.warn('Redis reconnecting...');
    });

    redisClient.on('ready', () => {
      logger.info('Redis ready to accept commands');
    });
  } catch (error) {
    logger.error('Redis connection failed:', error.message);
  }
};

const getRedisClient = () => {
  if (!redisClient) {
    throw new Error('Redis client not initialized. Call connectRedis() first.');
  }
  return redisClient;
};

module.exports = connectRedis;
module.exports.getRedisClient = getRedisClient;
