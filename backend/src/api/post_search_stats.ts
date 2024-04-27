import { RequestHandler } from 'express';

import { Logger } from '../logger.js';
import { DB } from '../init_db.js';
import formStatResult from '../utils/form_stat_result.js';

/**
 * post_search_stats()
 * Handler for POST /api/search_stats endpoint
 * @param logger logger
 * @param db_connection connection to mysql database
 * @returns express request handler
 */
export default function post_search_stats(logger: Logger, db_connection: DB): RequestHandler {
  return async (req, res) => {
    const { user_id } = req.session;
    // No uid means something is wrong with session
    if (user_id === undefined) {
      logger.debug('Session does not include user_id, invalidating session');
      req.session.destroy(() => {});
      res.status(401).send();
      return;
    }

    const { search } = req.body;
    // Missing fields, bad request
    if (search === '') {
      logger.debug('Invalid request, missing search string');
      res.status(400).send();
      return;
    }

    let response;
    try {
      [response] = await db_connection.execute('CALL GetItemStats(?, ?);', [user_id, search]);
    } catch (error) {
      logger.warn('Failed to get item statistics.', error);
      res.status(500).send();
      return;
    }

    const result = formStatResult(response[0]);
    res.status(200).send(result);
    return;
  };
}
