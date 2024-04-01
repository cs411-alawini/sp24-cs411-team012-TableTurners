import express from 'express';
import mysql from 'mysql2/promise';

/**
 * createAPIRouter()
 * Creates express api router
 * @param db_connection mysql2 connection to mysql database
 * @returns express router
 */
export default function createAPIRouter(db_connection: mysql.Connection): express.Router {
  const api_router = express.Router();

  // Temporary for testing boilerplate
  db_connection;
  api_router.get('/', (req, res) => {
    res.send('Hello, World!');
  });

  return api_router;
}
