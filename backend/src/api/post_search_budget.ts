import { RequestHandler } from 'express';

import { Logger } from '../logger.js';
import { DB } from '../init_db.js';

/**
 * post_search_budget()
 * Handler for POST /api/search_budget endpoint
 * @param logger logger
 * @param db_connection connection to mysql database
 * @returns express request handler
 */
export default function post_search_budget(logger: Logger, db_connection: DB): RequestHandler {
  return async (req, res) => {
    const { user_id } = req.session;
    // No uid means something is wrong with session
    if (user_id === undefined) {
      logger.debug('Session does not include user_id, invalidating session');
      req.session.destroy(() => {});
      res.status(401).send();
      return;
    }

    const { search, budget } = req.body;
    // Missing fields, bad request
    if (search === '' || budget === 0) {
      logger.debug('Invalid request, missing search string or budget');
      res.status(400).send();
      return;
    }

    console.log(search, budget);

    let response;
    try {
      [response] = await db_connection.execute('CALL BudgetSearch(?, ?);', [budget, search]);
    } catch (error) {
      logger.warn('Failed to get item statistics.', error);
      res.status(500).send();
      return;
    }

    console.log(response);

    try {
      await db_connection.execute('INSERT INTO SearchHistory (user_id, search_string) VALUES(?, ?)', [user_id, search]);
    } catch {
      /* Ignore if this fails (save history may be disabled) */
    }

    const result = response[0];
    res.status(200).send(result);
    return;
  };
}
