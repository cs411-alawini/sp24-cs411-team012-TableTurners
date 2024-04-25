import axios from 'axios';

/**
 * post_login()
 * POST /api/login endpoint handler
 * @param email user email
 * @param password user password
 * @returns true is successfully logged in, false otherwise
 */
export default async function post_login(email: string, password: string): Promise<boolean> {
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
    // Incorrect email/password if 401, unknown error otherwise
    if (axios.isAxiosError(error) && error.response && error.response.status === 401) return false;
    throw error;
  }

  /* No error, return true */
  return true;
}
