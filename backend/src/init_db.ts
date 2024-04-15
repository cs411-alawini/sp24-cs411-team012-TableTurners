import mysql from 'mysql2/promise';

import { Logger } from './logger.js';

const DB_NAME = 'Grocery-Aid-Database';
const RETRY_TRIES = 10;

export type DB = mysql.Connection;

/**
 * _tryInitDB()
 * Attempts to initialize database with tables for grocery aid
 * Throws error if any part fails
 * @param host hostname of mysql server
 * @param port port of mysql server
 * @param user username to authenticate with mysql server
 * @param password password to authenticate with mysql server
 * @returns mysql2 connection to mysql database
 */
async function _tryInitDB(host: string, port: number, user: string, password: string): Promise<DB> {
  const connection = await mysql.createConnection({
    port,
    host,
    user,
    password,
  });

  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;`);
  await connection.query(`USE \`${DB_NAME}\`;`);
  await connection.query(`
CREATE TABLE IF NOT EXISTS Stores(
  store_id      INT AUTO_INCREMENT,
  store_name    VARCHAR(255),
  PRIMARY KEY   (store_id)
);
  `);

  await connection.query(`
CREATE TABLE IF NOT EXISTS Products(
  product_id    INT AUTO_INCREMENT,
  store_id      INT NOT NULL,
  name          VARCHAR(255),
  price         REAL,
  PRIMARY KEY   (product_id),
  FOREIGN KEY   (store_id) REFERENCES Stores(store_id)
);
  `);

  await connection.query(`
CREATE TABLE IF NOT EXISTS Accounts(
  user_id       INT AUTO_INCREMENT,
  first_name    VARCHAR(255),
  last_name     VARCHAR(255),
  password_hash VARCHAR(255) NOT NULL,
  email_addr    VARCHAR(255) NOT NULL,
  save_history  BOOL DEFAULT 1,
  PRIMARY KEY   (user_id)
);
  `);

  await connection.query(`
CREATE TABLE IF NOT EXISTS SearchHistory(
  history_id    INT AUTO_INCREMENT,
  user_id       INT NOT NULL,
  search_string VARCHAR(255),
  timestamp     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY   (history_id),
  FOREIGN KEY   (user_id) REFERENCES Accounts(user_id)
    ON DELETE CASCADE
);
  `);

  await connection.query(`
CREATE TABLE IF NOT EXISTS FoodGroup(
  food_id       INT AUTO_INCREMENT,
  product_id    INT NOT NULL,
  grains        BOOL NOT NULL,
  spices        BOOL NOT NULL,
  condiments    BOOL NOT NULL,
  meats         BOOL NOT NULL,
  fruits        BOOL NOT NULL,
  vegetables    BOOL NOT NULL,
  dairy         BOOL NOT NULL,
  other         BOOL NOT NULL,
  PRIMARY KEY   (food_id),
  FOREIGN KEY   (product_id) REFERENCES Products(product_id)
    ON DELETE CASCADE
);
  `);

  return connection;
}

/**
 * initDB()
 * Initializes the MySQL database, retrying on failure up to RETRY_CONNECT times
 * Fatal error if connection/initialization continues to fail
 * @param logger logger
 * @returns connection to MySQL database
 */
export default async function initDB(logger: Logger): Promise<mysql.Connection> {
  const SQL_PORT = process.env.SQL_PORT ? parseInt(process.env.SQL_PORT) : 3306;
  const SQL_HOST = process.env.SQL_HOST;
  const SQL_USER = process.env.SQL_USER;
  const SQL_PWD = process.env.SQL_PWD;
  if (!SQL_HOST) throw Error('FATAL: SQL_HOST not defined!');
  if (!SQL_USER) throw Error('FATAL: SQL_USER not defined!');
  if (!SQL_PWD) throw Error('FATAL: SQL_PWD not defined!');

  for (let i = 0; i < RETRY_TRIES; i++) {
    try {
      const db_connection = await _tryInitDB(SQL_HOST, SQL_PORT, SQL_USER, SQL_PWD);
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
