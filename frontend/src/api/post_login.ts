import axios from 'axios';

/**
 * post_login()
 * POST /api/login endpoint handler
 * @param email user email
 * @param password user password
 * @returns true is successfully logged in, false otherwise
 */
export default async function post_login(email: string, password: string): Promise<number> {
  /* Submit data to API and wait for response */
  try {
    await axios({
      method: 'post',
      url: '/api/login',
      timeout: 2000,
      data: { email, password },
    });
    /* Catch error if present */
  } catch (error) {
    // Return known error codes (400, 401, 500). Otherwise, pass error code on bc
    // the error is unknown.
    if (
      axios.isAxiosError(error) &&
      error.response &&
      (error.response.status === 401 || error.response.status === 400 || error.response.status === 500)
    )
      return error.response.status;
    throw error;
  }

  /* No error, return true */
  return 200;
}
