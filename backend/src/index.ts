import http from 'http';
import express, { RequestHandler } from 'express';
import dotenv from 'dotenv';

import createAPIRouter from './api/api_router.js';
import initDB, { DB } from './init_db.js';
import initRedis, { RedisClient } from './init_redis.js';
import createLogger, { Logger } from './logger.js';

/**
 * _createExpressLogger()
 * Creates express middleware for logging incoming requests
 * @param logger logger
 * @returns express middleware for logging
 */
function _createExpressLogger(logger: Logger): RequestHandler {
  return async (req, res, next) => {
    next();
    res.once('finish', () => {
      const request = `"${req.method} ${req.originalUrl} HTTP/${req.httpVersion} "`;
      logger.info(
        `${request} "${req.headers.host}" ${res.statusCode} "${req.socket.remoteAddress}" "${req.get('User-Agent')}"`,
      );
    });
  };
}

/**
 * _startAPIWebserver()
 * Initializes and starts the express webserver for serving the backend API
 * @param logger logger
 * @param db_connection connection to mysql database
 * @param redis_connection connection to redis cache
 * @returns node http server
 */
function _startAPIWebserver(logger: Logger, db_connection: DB, redis_connection: RedisClient): http.Server {
  const PORT = process.env.PORT;
  if (!PORT) throw Error('FATAL: PORT not defined!');

  const app = express();
  app.use(_createExpressLogger(logger));

  // Set the number of trusted proxy hops (for use when HTTPS cookies are on)
  app.set('trust proxy', process.env.TRUST_PROXY_COUNT);

  app.use('/api', createAPIRouter(logger, db_connection, redis_connection));

  // Default 404 route
  app.all('/*', (req, res) => {
    res.status(404);
    res.send('404 Not Found');
  });

  const server = app.listen(PORT, () => {
    logger.info(`Backend webserver listening on port ${PORT}`);
  });

  return server;
}

(async () => {
  // Load environment variables from .env file if not in production env (docker)
  if (process.env.NODE_ENV !== 'production') dotenv.config();

  const logger = createLogger();
  if (process.env.NODE_ENV !== 'production') {
    logger.warn('Using development environment configuration');
  }

  // Initialize connections before starting webserver
  const db_connection = await initDB(logger);
  const redis_connection = await initRedis(logger);
  const server = _startAPIWebserver(logger, db_connection, redis_connection);

  // Close connection and server on SIGTERM for a graceful exit
  process.on('SIGTERM', async () => {
    server.close();
    await redis_connection.disconnect();
    await db_connection.end();

    // eslint-disable-next-line no-process-exit
    process.exit();
  });
})();
