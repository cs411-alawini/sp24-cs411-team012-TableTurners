import { RequestHandler } from 'express';

import { Logger } from '../logger.js';
import { DB } from '../init_db.js';

/**
 * post_del_account()
 * Handler for POST /api/del_account endpoint
 * @param logger logger
 * @param db_connection connection to mysql database
 * @returns express request handler
 */
export default function post_del_account(logger: Logger, db_connection: DB): RequestHandler {
  return async (req, res) => {
    const { user_id } = req.session;
    // No uid means something is wrong with session
    if (user_id === undefined) {
      logger.debug('Session does not include user_id, invalidating session');
      req.session.destroy(() => {});
      res.status(401).send();
      return;
    }

    let response;
    try {
      [response] = await db_connection.execute('DELETE FROM Accounts Where user_id = ?;', [user_id]);
    } catch (error) {
      logger.error('Failed to fetch password hash.', error);
      res.status(500).send();
      return;
    }

    // If not rows affected, server error
    if (response.affectedRows === 0) {
      res.status(500).send();
      return;
    }

    // Delete user's session deleting their account
    req.session.destroy(() => {});
    res.status(200).send();
  };
}
