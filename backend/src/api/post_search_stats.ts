import { RequestHandler } from 'express';

import { Logger } from '../logger.js';
import { DB } from '../init_db.js';
import validateString from '../utils/validate_string.js';

/**
 * formStatResult()
 * Reformats the database results into api format
 * @param results database results of GetItemStats stored procedure call
 * @returns reformatted results, more suited for http api
 */
function formStatResult(results) {
  return results.map((result) => {
    const { store_name, avg_price, std_price, max_price, min_price, total_count, prod_avg_price, prod_count } = result;
    const mapped_result = {
      store_name,
      avg_price,
      std_price,
      max_price,
      min_price,
      total_count,
      prod_avg_price,
      prod_count,
      bucket_labels: [] as Array<{ start: number; end: number }>,
      buckets: [] as Array<number>,
    };

    let bucket_start = -3;
    let bucket_end = -2;
    if (avg_price + bucket_start * std_price >= 0) {
      mapped_result.bucket_labels.push({ start: 0, end: avg_price + bucket_start * std_price });
      mapped_result.buckets.push(result[`(min)-(${bucket_start})`]);
    }

    for (; bucket_end <= 3; bucket_start = bucket_end++) {
      if (avg_price + bucket_end * std_price >= 0) {
        mapped_result.bucket_labels.push({
          start: Math.max(0, avg_price + bucket_start * std_price),
          end: avg_price + bucket_end * std_price,
        });
        mapped_result.buckets.push(result[`(${bucket_start})-(${bucket_end})`]);
      }
    }
    if (avg_price + bucket_end * std_price >= 0) {
      mapped_result.bucket_labels.push({ start: avg_price + bucket_end * std_price, end: max_price });
      mapped_result.buckets.push(result[`(${bucket_start})-(max)`]);
    }
    return mapped_result;
  });
}

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
    let { search } = req.body;
    search = validateString(search, true, 256);

    if (!search) {
      logger.debug('Invalid request, invalid search string');
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
  };
}
