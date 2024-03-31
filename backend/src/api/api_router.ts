import express from 'express';
import mysql from 'mysql2/promise';

export default function createAPIRouter(db_connection: mysql.Connection) {
  const api_router = express.Router();

  api_router.get('/', (req, res) => {
    res.send('Hello, World!');
  });

  db_connection;

  return api_router;
}
