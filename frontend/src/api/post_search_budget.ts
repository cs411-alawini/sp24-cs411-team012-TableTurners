import axios from 'axios';

export type BudgetResult = {
  store_name: string;
  name: string;
  price: number;
};
export type BudgetResults = Array<BudgetResult>;

/**
 * post_search_budget()
 * POST /api/search_budget endpoint handler
 * @param search search string
 * @param budget search budget parameter
 * @returns budget search results if successful, undefined if not
 */
export default async function post_search_budget(search: string, budget: number): Promise<BudgetResults | undefined> {
  try {
    const res = await axios({
      method: 'post',
      url: '/api/search_budget',
      timeout: 60000,
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
