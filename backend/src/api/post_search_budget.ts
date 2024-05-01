import { RequestHandler } from 'express';

import { Logger } from '../logger.js';
import { DB } from '../init_db.js';
import validateString from '../utils/validate_string.js';
import validateNumber from '../utils/validate_number.js';

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
    let { search, budget } = req.body;
    search = validateString(search, true, 8192);
    budget = validateNumber(budget, 0);

    // Missing fields, bad request
    if (!search || budget === undefined) {
      logger.debug('Invalid request, invalid search string or budget');
      res.status(400).send();
      return;
    }

    let response;
    try {
      [response] = await db_connection.execute('CALL BudgetSearch(?, ?, ?);', [user_id, budget, search]);
    } catch (error) {
      logger.warn('Failed to get item statistics.', error);
      res.status(500).send();
      return;
    }

    const result = response[0];
    res.status(200).send(result);
  };
}
