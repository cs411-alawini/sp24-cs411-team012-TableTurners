import axios from 'axios';

/**
 * post_search()
 * POST /api/search endpoint handler
 * @param something idk something
 * @returns idk do something
 */
export default async function post_search(): Promise<void> {
  try {
    //
  } catch (error) {
    // Incorrect email/password if 401, unknown error otherwise
    if (axios.isAxiosError(error) && error.response && error.response.status === 401) return;
    throw error;
  }
}
