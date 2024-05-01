import { RequestHandler } from 'express';
import argon2 from 'argon2';

import { Logger } from '../logger.js';
import { DB } from '../init_db.js';
import validateString from '../utils/validate_string.js';

/**
 * post_signup()
 * Handler for POST /api/signup endpoint
 * @param logger logger
 * @param db_connection connection to mysql database
 * @returns express request handler
 */
export default function post_signup(logger: Logger, db_connection: DB): RequestHandler {
  return async (req, res) => {
    let { email, password, first_name, last_name } = req.body;
    email = validateString(email, true, 256);
    password = validateString(password);
    first_name = validateString(first_name, false, 256);
    last_name = validateString(last_name, false, 256);

    if (!email || password === undefined || !first_name || !last_name) {
      logger.debug('Invalid request, missing email, password, first_name, or last_name');
      res.status(400).send();
      return;
    }

    /* Hash the password */
    let hashedPassword: string;
    try {
      /* Hash using Argon2 */
      hashedPassword = await argon2.hash(password);
    } catch (error) {
      /* Handle error if hashing fails */
      logger.error('Failed to hash password.', error);
      res.status(500).send();
      return;
    }

    let response;
    try {
      response = await db_connection.execute(
        'INSERT INTO Accounts (email_addr, password_hash, first_name, last_name) VALUES (?, ?, ?, ?);',
        [email, hashedPassword, first_name, last_name],
      );
    } catch (error) {
      logger.warn('An error occurred when creating account.', error);
      res.status(500).send();
      return;
    }

    req.session.user_id = response[0].insertId;
    res.status(201).send();
    return;
  };
}
