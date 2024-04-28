import axios from 'axios';

export type History = Array<{ history_id: number; search_string: string; timestamp: string }>;

/**
 * get_history()
 * GET /api/history endpoint
 * @returns list of user history if successfully fetched, undefined if unauthorized
 */
export default async function get_history(): Promise<History | undefined> {
  try {
    const res = await axios({
      method: 'get',
      url: '/api/history',
      timeout: 10000,
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    // Ignore if unauthorized (401), unknown error otherwise
    if (axios.isAxiosError(error) && error.response && error.response.status === 401) return;
    throw error;
  }
}
