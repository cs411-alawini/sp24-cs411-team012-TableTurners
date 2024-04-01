import http from 'http';
import express from 'express';
import mysql from 'mysql2/promise';
import createAPIRouter from './api/api_router.js';
import initDB from './init_db.js';
import dotenv from 'dotenv';

/**
 * _startAPIWebserver()
 * Initializes and starts the express webserver for serving the backend API
 * @param db_connection mysql2 connection to mysql database
 * @returns node http server
 */
function _startAPIWebserver(db_connection: mysql.Connection): http.Server {
  const PORT = process.env.PORT;
  if (!PORT) throw Error('FATAL: PORT not defined!');

  const app = express();

  app.use('/api', createAPIRouter(db_connection));

  const server = app.listen(PORT, () => {
    console.log(`INFO: Backend webserver listening on port ${PORT}`);
  });

  return server;
}

(async () => {
  // Load environment variables from .env file if not in production env (docker)
  if (process.env.NODE_ENV !== 'production') dotenv.config();

  const db_connection = await initDB();
  const server = _startAPIWebserver(db_connection);

  // Close connection and server on exit so that docker exits gracefully
  process.on('SIGTERM', async () => {
    server.close();
    await db_connection.end();

    // eslint-disable-next-line no-process-exit
    process.exit();
  });
})();
