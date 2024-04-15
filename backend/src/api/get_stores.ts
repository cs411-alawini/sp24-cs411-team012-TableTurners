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
  return (req, res) => {};
}
