import { RequestHandler } from 'express';
import argon2 from 'argon2';

import { Logger } from '../logger.js';
import { DB } from '../init_db.js';
import validateString from '../utils/validate_string.js';

/**
 * post_login()
 * Handler for POST /api/login endpoint
 * @param logger logger
 * @param db_connection connection to mysql database
 * @returns express request handler
 */
export default function post_login(logger: Logger, db_connection: DB): RequestHandler {
  return async (req, res) => {
    let { email, password } = req.body;
    email = validateString(email, true, 256);
    password = validateString(password);

    if (!email || password === undefined) {
      logger.debug('Invalid request, invalid email or password');
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
    if (response.length === 0) {
      logger.debug('User not found, unauthorized!');
      res.status(401).send();
      return;
    }

    // More than 1 user found, databse issue
    if (response.length > 1) {
      logger.warn('Email found multiple times in database!');
      res.status(500).send();
      return;
    }

    try {
      // Hash doesn't match, unauthorized
      if (!(await argon2.verify(response[0].password_hash, password))) {
        logger.debug('Password hash did not match, unauthorized!');
        res.status(401).send();
        return;
      }
    } catch (error) {
      logger.warn('Failed to verify password.', error);
      res.status(500).send();
      return;
    }

    req.session.user_id = response[0].user_id;
    res.status(200).send();
  };
}
