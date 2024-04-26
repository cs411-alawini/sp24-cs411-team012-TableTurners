import { RequestHandler } from 'express';
import argon2 from 'argon2';

import { Logger } from '../logger.js';
import { DB } from '../init_db.js';

/**
 * post_signup()
 * Handler for POST /api/signup endpoint
 * @param logger logger
 * @param db_connection connection to mysql database
 * @returns express request handler
 */
export default function post_signup(logger: Logger, db_connection: DB): RequestHandler {
  return async (req, res) => {
    const { email, password, first_name, last_name } = req.body;

    // Missing fields, bad request
    if ( email === '' || password === '' || first_name === ''|| last_name === '' ){
      logger.debug( 'Invalid request, missing email or password' );
      res.status( 400 ).send();
      return;
    }

    /* Hash the password */
    async function hashPassword( password: string ): Promise<string> {
      try{
        /* Hash using Argon2 */
        const hashedPassword = await argon2.hash( password );
        return hashedPassword;
      } catch( error ){
        /* Handle error if hashing fails */
        logger.error( 'Failed to hash password' );
        throw error;
      }
    }

    let response;
    try{
      const hashedPassword = await hashPassword( password );
      [response] = await db_connection.execute( 'INSERT INTO Accounts (email_addr, password_hash, first_name, last_name) VALUES (?, ?, ?, ?);', [email, hashedPassword, first_name, last_name]);
    } catch( error ){
      console.log( error );
      logger.error( 'An error occurred when submitting the record' );
      res.status( 500 ).send();
      return;
    }

    res.status( 201 ).send();
    return;


  };
}
