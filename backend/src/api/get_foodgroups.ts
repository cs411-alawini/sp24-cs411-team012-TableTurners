import { RequestHandler } from 'express';

import { Logger } from '../logger.js';
import { DB } from '../init_db.js';

/**
 * get_foodgroups()
 * Handler for GET /api/foogroups endpoint
 * @param logger logger
 * @param db_connection connection to mysql database
 * @returns express request handler
 */
export default function get_foodgroups(logger: Logger, db_connection: DB): RequestHandler {
  return async (req, res) => {
    let response;
    try {
      [response] = await db_connection.execute('SHOW COLUMNS FROM FoodGroup WHERE Type = "tinyint(1)";');
    } catch (error) {
      logger.error('Failed to fetch food groups.', error);
      res.status(500).send();
      return;
    }

    const stores = response.map(({ Field }) => Field);
    res.status(200).send(stores);
  };
}
