import { RequestHandler } from 'express';

import { Logger } from '../logger.js';
import { DB } from '../init_db.js';
import validateBool from '../utils/validate_bool.js';

/**
 * post_set_save_hist()
 * Handler for POST /api/set_save_hist endpoint
 * @param logger logger
 * @param db_connection connection to mysql database
 * @returns express request handler
 */
export default function post_set_save_hist(logger: Logger, db_connection: DB): RequestHandler {
  return async (req, res) => {
    const { user_id } = req.session;
    let { save_history } = req.body;
    save_history = validateBool(save_history);

    if (save_history === undefined) {
      logger.debug('Invalid request, invalid save history value');
      res.status(400).send();
      return;
    }

    try {
      await db_connection.execute('UPDATE Accounts SET save_history = ? WHERE user_id = ?;', [
        save_history ? 1 : 0,
        user_id,
      ]);
    } catch (error) {
      logger.error('Failed to update save_history value.', error);
      res.status(500).send();
      return;
    }

    res.status(200).send();
  };
}
