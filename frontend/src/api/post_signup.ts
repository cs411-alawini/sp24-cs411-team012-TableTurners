import axios from 'axios';

/**
 * post_signup()
 * POST /api/signup endpoint handler
 * @param email user email
 * @param password user password
 * @param first_name user first name
 * @param last_name user last name
 * @returns http response code (201 if successful)
 */
export default async function post_signup(
  email: string,
  password: string,
  first_name: string,
  last_name: string,
): Promise<number> {
  try {
    await axios({
      method: 'post',
      url: '/api/signup',
      timeout: 2000,
      data: { email, password, first_name, last_name },
    });
  } catch (error) {
    // Incorrect email/password if 401, unknown error otherwise
    if (axios.isAxiosError(error) && error.response && (error.response.status === 400 || error.response.status === 500))
      return error.response.status;
    throw error;
  }
  return 201;
}
