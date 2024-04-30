import axios from 'axios';

/**
 * post_search_budget()
 * POST /api/search_budget endpoint handler
 * @param something idk something
 * @returns idk do something
 */
export type budget_results = Array<object>;
export default async function post_search_budget(search: string, budget: number): Promise<budget_results | undefined> {
  try {
    const res = await axios({
      method: 'post',
      url: '/api/post_search_budget',
      timeout: 1000000,
      data: { search, budget },
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    // Incorrect email/password if 401, unknown error otherwise
    if (axios.isAxiosError(error) && error.response && error.response.status === 401) return;
    throw error;
  }
}

