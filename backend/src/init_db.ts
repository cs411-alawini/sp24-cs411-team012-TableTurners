import mysql from 'mysql2/promise';

import { Logger } from './logger.js';

const DB_NAME = 'Grocery-Aid-Database';
const RETRY_TRIES = 10;

export type DB = mysql.Pool;

/**
 * initDB()
 * Initializes the MySQL database, retrying on failure up to RETRY_CONNECT times
 * Fatal error if connection/initialization continues to fail
 * @param logger logger
 * @returns connection to MySQL database
 */
export default async function initDB(logger: Logger): Promise<DB> {
  const SQL_PORT = process.env.SQL_PORT ? parseInt(process.env.SQL_PORT) : 3306;
  const SQL_HOST = process.env.SQL_HOST;
  const SQL_USER = process.env.SQL_USER;
  const SQL_PWD = process.env.SQL_PWD;
  if (!SQL_PORT) throw Error('FATAL: SQL_PORT not defined!');
  if (!SQL_HOST) throw Error('FATAL: SQL_HOST not defined!');
  if (!SQL_USER) throw Error('FATAL: SQL_USER not defined!');
  if (!SQL_PWD) throw Error('FATAL: SQL_PWD not defined!');

  for (let i = 0; i < RETRY_TRIES; i++) {
    try {
      const db_connection = mysql.createPool({
        port: SQL_PORT,
        host: SQL_HOST,
        user: SQL_USER,
        password: SQL_PWD,
        database: DB_NAME,
      });
      logger.info('Successfully connected to MySQL database');
      return db_connection;
    } catch (error) {
      logger.error(error);

      if (i < RETRY_TRIES - 1) {
        logger.info('Connecting to MySQL database failed. Retrying in 1 second.');
        await new Promise((r) => setTimeout(r, 1000));
      }
    }
  }

  throw Error('FATAL: Failed to connect to MySQL database.');
}
