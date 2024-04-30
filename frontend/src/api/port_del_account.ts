import axios from 'axios';

/**
 * post_del_account()
 * POST /api/del_account endpoint handler
 * @returns true is successfully deleted, false if failed to authenticate
 */
export default async function post_del_account(): Promise<boolean> {
  try {
    await axios({
      method: 'post',
      url: '/api/del_account',
      timeout: 2000,
      withCredentials: true,
    });
  } catch (error) {
    // Incorrect email/password if 401, unknown error otherwise
    if (axios.isAxiosError(error) && error.response && error.response.status === 401) return false;
    throw error;
  }

  return true;
}
