import { RequestHandler } from 'express';

import { Logger } from '../logger.js';
import { DB } from '../init_db.js';

/**
 * get_logout()
 * Handler for GET /api/logout endpoint
 * @param logger logger
 * @param db_connection connection to mysql database
 * @returns express request handler
 */
export default function get_logout(logger: Logger, db_connection: DB): RequestHandler {
  return (req, res) => {
    req.session.destroy(() => {});
    res.status(200).send();
  };
}
