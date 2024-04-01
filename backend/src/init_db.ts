import mysql from 'mysql2/promise';

const DB_NAME = 'Grocery-Aid-Database';
const RETRY_CONNECT = 10;

/**
 * _tryInitDB()
 * Attempts to initialize database with tables for grocery aid
 * Throws error if any part fails
 * @param host hostname of mysql server
 * @param user username to authenticate with mysql server
 * @param password password to authenticate with mysql server
 * @returns mysql2 connection to mysql database
 */
async function _tryInitDB(host: string, user: string, password: string): Promise<mysql.Connection> {
  const connection = await mysql.createConnection({
    host,
    user,
    password,
  });

  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;`);
  await connection.query(`USE \`${DB_NAME}\`;`);
  await connection.query(`
CREATE TABLE IF NOT EXISTS Stores(
  store_id      INT,
  store_name    VARCHAR(255),
  PRIMARY KEY   (store_id)
);
  `);

  await connection.query(`
CREATE TABLE IF NOT EXISTS Products(
  product_id    INT,
  store_id      INT,
  name          VARCHAR(255),
  price         REAL,
  PRIMARY KEY   (product_id),
  FOREIGN KEY   (store_id) REFERENCES Stores(store_id)
);
  `);

  await connection.query(`
CREATE TABLE IF NOT EXISTS Accounts(
  user_id       INT,
  first_name    VARCHAR(255),
  last_name     VARCHAR(255),
  password_hash VARCHAR(255),
  email_addr    VARCHAR(255),
  PRIMARY KEY   (user_id)
);
  `);

  await connection.query(`
CREATE TABLE IF NOT EXISTS SearchHistory(
  history_id    INT,
  user_id       INT,
  search_string VARCHAR(255),
  timestamp     INT,
  PRIMARY KEY   (history_id),
  FOREIGN KEY   (user_id) REFERENCES Accounts(user_id)
    ON DELETE CASCADE
);
  `);

  // await connection.query(`
  // CREATE TABLE IF NOT EXISTS SearchHistory(
  //   history_id    INT,
  //   user_id       INT,
  //   search_string VARCHAR(255),
  //   timestamp     INT,
  //   PRIMARY KEY   (history_id),
  //   FOREIGN KEY   (user_id) REFERENCES Accounts(user_id)
  //     ON DELETE CASCADE
  // );
  //   `);

  return connection;
}

/**
 * initDB()
 * Initializes the mysql2 database, retrying on failure up to RETRY_CONNECT times
 * Fatal error if connection/initialization continues to fail
 * @returns mysql2 connection to mysql database
 */
async function initDB(): Promise<mysql.Connection> {
  const SQL_HOST = process.env.SQL_HOST;
  const SQL_USER = process.env.SQL_USER;
  const SQL_PWD = process.env.SQL_PWD;
  if (!SQL_HOST) throw Error('FATAL: SQL_HOST not defined!');
  if (!SQL_USER) throw Error('FATAL: SQL_USER not defined!');
  if (!SQL_PWD) throw Error('FATAL: SQL_PWD not defined!');

  for (let i = 0; i < RETRY_CONNECT; i++) {
    try {
      return _tryInitDB(SQL_HOST, SQL_USER, SQL_PWD);
    } catch (error) {
      console.error(error);

      if (i < RETRY_CONNECT - 1) {
        console.error('INFO: Retrying in 1 second.');
        await new Promise((r) => setTimeout(r, 1000));
      }
    }
  }

  throw Error('FATAL: Failed to connect to database.');
}

export default initDB;
