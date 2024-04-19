import axios from 'axios';

/**
 * post_signup()
 * POST /api/signup endpoint handler
 * @param email user email
 * @param password user password
 * @param first_name user first name
 * @param last_name user last name
 * @returns true is successfully created user, false otherwise (e.g., email exists already)
 */
export default async function post_signup(
  email: string,
  password: string,
  first_name: string,
  last_name: string,
): Promise<boolean> {
  try {
    //
  } catch (error) {
    // Incorrect email/password if 401, unknown error otherwise
    if (axios.isAxiosError(error) && error.response && error.response.status === 401) return false;
    throw error;
  }

  return true;
}
