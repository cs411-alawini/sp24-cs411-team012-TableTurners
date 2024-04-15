import { RedisClientType, RedisFunctions, RedisModules, RedisScripts, createClient } from 'redis';

import { Logger } from './logger.js';

const RETRY_TRIES = 10;

export type RedisClient = RedisClientType<RedisModules, RedisFunctions, RedisScripts>;

/**
 * initRedis()
 * Initializes the redis cache connection, retrying on failure up to RETRY_CONNECT times
 * Fatal error if connection/initialization continues to fail
 * @param logger logger
 * @returns connection to redis cache
 */
export default async function initRedis(logger: Logger): Promise<RedisClient> {
  const REDIS_URL = process.env.REDIS_URL;
  for (let i = 0; i < RETRY_TRIES; i++) {
    try {
      const client = await createClient({ url: REDIS_URL }).connect();
      logger.info('Successfully connected to Redis cache');
      return client;
    } catch (error) {
      logger.error(error);

      if (i < RETRY_TRIES - 1) {
        logger.info('Connecting to Redis cache failed. Retrying in 1 second.');
        await new Promise((r) => setTimeout(r, 1000));
      }
    }
  }

  throw Error('FATAL: Failed to connect to Redis cache.');
}
