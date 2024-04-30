import { RequestHandler } from 'express';

import { Logger } from '../logger.js';
import { DB } from '../init_db.js';
import keywordSearch from '../utils/keyword_search_result.js';

/**
 * post_search()
 * Handler for POST /api/search endpoint
 * @param logger logger
 * @param db_connection connection to mysql database
 * @returns express request handler
 */
export default function post_search(logger: Logger, db_connection: DB): RequestHandler {
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
      [response] = await db_connection.execute(
        `
        SELECT Stores.store_name, Products.name, Products.price 
        FROM Stores JOIN Products 
          ON Stores.store_id = Products.store_id 
        WHERE Products.name LIKE ?
        ORDER BY Stores.store_name ASC, Products.price ASC
  `,
        [`%${search}%`],
      );
    } catch (error) {
      logger.warn('Failed to get item statistics.', error);
      res.status(500).send();
      return;
    }

    try {
      await db_connection.execute('INSERT INTO SearchHistory (user_id, search_string) VALUES(?, ?)', [user_id, search]);
    } catch {
      /* Ignore if this fails (save history may be disabled) */
    }

    const result = keywordSearch(response);
    res.status(200).send(result);
    return;
  };
}
