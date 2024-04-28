import axios from 'axios';

/**
 * post_set_save_hist()
 * POST /api/set_save_hist endpoint handler
 * @param save_history value save history should be sent to
 * @returns true if successful, false if not authorized
 */
export default async function post_set_save_hist(save_history: boolean): Promise<boolean> {
  try {
    await axios({
      method: 'post',
      url: '/api/set_save_hist',
      timeout: 2000,
      data: { save_history },
      withCredentials: true,
    });
  } catch (error) {
    // Incorrect email/password if 401, unknown error otherwise
    if (axios.isAxiosError(error) && error.response && error.response.status === 401) return false;
    throw error;
  }
  return true;
}
