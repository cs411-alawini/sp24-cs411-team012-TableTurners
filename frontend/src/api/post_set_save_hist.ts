import axios from 'axios';

/**
 * post_set_save_hist()
 * POST /api/set_save_hist endpoint handler
 * @param something idk something
 * @returns idk do something
 */
export default async function post_set_save_hist(): Promise<void> {
  try {
    //
  } catch (error) {
    // Incorrect email/password if 401, unknown error otherwise
    if (axios.isAxiosError(error) && error.response && error.response.status === 401) return;
    throw error;
  }
}
