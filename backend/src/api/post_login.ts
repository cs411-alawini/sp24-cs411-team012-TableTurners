import { RequestHandler } from 'express';
import argon2 from 'argon2';

import { Logger } from '../logger.js';
import { DB } from '../init_db.js';

/**
 * post_login()
 * Handler for POST /api/login endpoint
 * @param logger logger
 * @param db_connection connection to mysql database
 * @returns express request handler
 */
export default function post_login(logger: Logger, db_connection: DB): RequestHandler {
  return async (req, res) => {
    const { email, password } = req.body;

    // Missing fields, bad request
    if (email === undefined || password === undefined) {
      res.status(400).send();
      return;
    }

    let response;
    try {
      [response] = await db_connection.execute('SELECT user_id, password_hash FROM Accounts WHERE email_addr = ?;', [email]);
    } catch (error) {
      logger.error('Failed to fetch password hash.', error);
      res.status(500).send();
      return;
    }

    // User not found, unauthorized
    if (response.length !== 1) {
      res.status(401).send();
      return;
    }

    try {
      // Hash doesn't mash, unauthorized
      if (!(await argon2.verify(response[0].password_hash, password))) {
        res.status(401).send();
        return;
      }
    } catch (error) {
      logger.error('Failed to verify password.', error);
      res.status(500).send();
      return;
    }

    req.session.authenticated = true;
    req.session.user_id = response[0].user_id;
    res.status(200).send();
  };
}
