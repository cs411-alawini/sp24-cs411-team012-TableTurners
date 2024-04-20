import axios from 'axios';

/**
 * post_login()
 * POST /api/login endpoint handler
 * @param email user email
 * @param password user password
 * @returns true is successfully logged in, false otherwise
 */
export default async function post_login(email: string, password: string): Promise<boolean> {
  try {
    await axios.post('/api/login', { email, password });
  } catch (error) {
    // Incorrect email/password if 401, unknown error otherwise
    if (axios.isAxiosError(error) && error.response && error.response.status === 401) return false;
    throw error;
  }

  return true;
}
