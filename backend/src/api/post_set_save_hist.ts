import { RequestHandler } from 'express';

import { Logger } from '../logger.js';
import { DB } from '../init_db.js';

/**
 * post_set_save_hist()
 * Handler for POST /api/set_save_hist endpoint
 * @param logger logger
 * @param db_connection connection to mysql database
 * @returns express request handler
 */
export default function post_set_save_hist(logger: Logger, db_connection: DB): RequestHandler {
  return (req, res) => {};
}
