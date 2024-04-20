import crypto from 'crypto';
import bodyParser from 'body-parser';
import express, { RequestHandler } from 'express';
import session from 'express-session';
import RedisStore from 'connect-redis';

import { RedisClient } from '../init_redis.js';
import { Logger } from '../logger.js';

import get_foodgroups from './get_foodgroups.js';
import get_history from './get_history.js';
import get_profile from './get_profile.js';
import get_stores from './get_stores.js';
import post_login from './post_login.js';
import post_search from './post_search.js';
import post_signup from './post_signup.js';
import get_logout from './get_logout.js';
import { DB } from '../init_db.js';

const SESSION_LENGTH = 60 * 60 * 1000;

// Decalare session object type
declare module 'express-session' {
  interface SessionData {
    user_id: number;
  }
}

/**
 * configRouter()
 * Creates express router and configures express sessions
 * @param logger logger
 * @param redis_connection connection to redis cache
 * @returns express router
 */
function _configRouter(logger: Logger, redis_connection: RedisClient): express.Router {
  const api_router = express.Router();
  api_router.use(bodyParser.json());

  // Setup express sessions and use random secret in production environment
  const session_config = {
    store: new RedisStore({
      client: redis_connection,
      prefix: 'GA_SESS:',
    }),
    resave: true,
    rolling: true,
    saveUninitialized: false,
    secret: crypto.randomBytes(64).toString('base64'),
    cookie: {
      httpOnly: true,
      secure: true,
      sameSite: true,
      maxAge: SESSION_LENGTH,
    },
  };
  if (process.env.NODE_ENV !== 'production') {
    logger.warn('Using development environment session secret');
    session_config.secret = 'secret';
  }
  if (process.env.USE_HTTPS_COOKIES !== 'true') {
    logger.warn('Not using HTTPS cookies');
    session_config.cookie.secure = false;
  }
  api_router.use(session(session_config));

  return api_router;
}

/**
 * createAPIRouter()
 * Creates express api router
 * @param logger logger
 * @param db_connection connection to mysql database
 * @param redis_connection connection to redis cache
 * @returns express router
 */
export default function createAPIRouter(logger: Logger, db_connection: DB, redis_connection: RedisClient): express.Router {
  const api_router = _configRouter(logger, redis_connection);

  // express middleware to reject unauthenticated sessions
  const _auth_endpoint: RequestHandler = (req, res, next) => {
    if (req.session.user_id === undefined) {
      logger.debug('user_id was undefined, rejecting authentication');
      res.status(401).send();
      return;
    }
    // Refresh user's session timeout
    req.session.touch();
    next();
  };

  // unauthenticated endpoints
  api_router.post('/login', post_login(logger, db_connection));
  api_router.post('/signup', post_signup(logger, db_connection));

  api_router.get('/logout', get_logout(logger, db_connection));

  // authenticated endpoints
  api_router.get('/profile', _auth_endpoint, get_profile(logger, db_connection));
  api_router.get('/history', _auth_endpoint, get_history(logger, db_connection));
  api_router.get('/stores', _auth_endpoint, get_stores(logger, db_connection));
  api_router.get('/foodgroups', _auth_endpoint, get_foodgroups(logger, db_connection));

  api_router.post('/search', _auth_endpoint, post_search(logger, db_connection));

  return api_router;
}
