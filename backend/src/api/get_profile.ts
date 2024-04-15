import { RequestHandler } from 'express';

import { Logger } from '../logger.js';
import { DB } from '../init_db.js';

/**
 * get_profile()
 * Handler for GET /api/profile endpoint
 * @param logger logger
 * @param db_connection connection to mysql database
 * @returns express request handler
 */
export default function get_profile(logger: Logger, db_connection: DB): RequestHandler {
  return async (req, res) => {
    const { user_id } = req.session;
    // No uid means something is wrong with session
    if (user_id === undefined) {
      req.session.destroy(() => {});
      res.status(401).send();
      return;
    }

    let response;
    try {
      [response] = await db_connection.execute(
        'SELECT first_name, last_name, email_addr, save_history FROM Accounts WHERE user_id = ?',
        [user_id],
      );
    } catch (error) {
      logger.error(`Failed to fetch user profile. {user_id: ${user_id}}`, error);
      res.status(500).send();
      return;
    }

    // Invalid user_id, unauthorized
    if (response.length !== 1) {
      req.session.destroy(() => {});
      res.status(401).send();
      return;
    }

    const { first_name, last_name, email_addr, save_hist } = response[0];
    res.send({ first_name, last_name, email_addr, save_history: save_hist !== 0 });
  };
}
