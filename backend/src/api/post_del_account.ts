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

    let response;
    try {
      [response] = await db_connection.execute('DELETE FROM Accounts WHERE user_id = ?;', [user_id]);
    } catch (error) {
      logger.error('Failed to delete user.', error);
      res.status(500).send();
      return;
    }

    // If no rows affected, server error
    if (response.affectedRows === 0) {
      logger.warn('No user deleted when expected');
      res.status(500).send();
      return;
    }

    // Delete user's session after deleting their account
    req.session.destroy(() => {});
    res.status(200).send();
  };
}
