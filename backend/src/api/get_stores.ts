import { RequestHandler } from 'express';

import { Logger } from '../logger.js';
import { DB } from '../init_db.js';

/**
 * get_stores()
 * Handler for GET /api/stores endpoint
 * @param logger logger
 * @param db_connection connection to mysql database
 * @returns express request handler
 */
export default function get_stores(logger: Logger, db_connection: DB): RequestHandler {
  return async (req, res) => {
    let response;
    try {
      [response] = await db_connection.execute('SELECT store_name FROM Stores;');
    } catch (error) {
      logger.error('Failed to fetch store names.', error);
      res.status(500).send();
      return;
    }

    const stores = response.map(({ store_name }) => store_name);
    res.status(200).send(stores);
  };
}
