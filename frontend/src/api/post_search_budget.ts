import axios from 'axios';

/**
 * post_search_budget()
 * POST /api/search_budget endpoint handler
 * @param something idk something
 * @returns idk do something
 */
export default async function post_search_budget(): Promise<void> {
  try {
    //
  } catch (error) {
    // Incorrect email/password if 401, unknown error otherwise
    if (axios.isAxiosError(error) && error.response && error.response.status === 401) return;
    throw error;
  }
}
