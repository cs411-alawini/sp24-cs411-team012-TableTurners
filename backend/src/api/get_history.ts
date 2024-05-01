import { RequestHandler } from 'express';

import { Logger } from '../logger.js';
import { DB } from '../init_db.js';

/**
 * get_history()
 * Handler for GET /api/history endpoint
 * @param logger logger
 * @param db_connection connection to mysql database
 * @returns express request handler
 */
export default function get_history(logger: Logger, db_connection: DB): RequestHandler {
  return async (req, res) => {
    const { user_id } = req.session;

    let response;
    try {
      [response] = await db_connection.execute(
        'SELECT history_id, search_string, timestamp FROM SearchHistory WHERE user_id = ? ORDER BY timestamp DESC;',
        [user_id],
      );
    } catch (error) {
      logger.error('Failed to fetch user history.', error);
      res.status(500).send();
      return;
    }

    res.status(200).send(response);
  };
}
