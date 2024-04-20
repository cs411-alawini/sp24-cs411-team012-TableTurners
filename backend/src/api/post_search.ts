import { RequestHandler } from 'express';

import { Logger } from '../logger.js';
import { DB } from '../init_db.js';

/**
 * post_search()
 * Handler for POST /api/search endpoint
 * @param logger logger
 * @param db_connection connection to mysql database
 * @returns express request handler
 */
export default function post_search(logger: Logger, db_connection: DB): RequestHandler {
  return (req, res) => {};
}
