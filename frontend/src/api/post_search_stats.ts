import axios from 'axios';

export type StatResult = {
  store_id: number;
  store_name: string;
  avg_price: number;
  std_price: number;
  max_price: number;
  min_price: number;
  total_count: number;
  prod_avg_price: number;
  prod_count: number;
  bucket_labels: Array<{ start: number; end: number }>;
  buckets: Array<number>;
};
export type StatResults = Array<StatResult>;

/**
 * post_search_stats()
 * POST /api/search_stats endpoint handler
 * @param search user's search string
 * @returns search results if successful, undefined otherwise
 */
export default async function post_search_stats(search: string): Promise<StatResults | undefined> {
  try {
    const res = await axios({
      method: 'post',
      url: '/api/search_stats',
      timeout: 60000,
      data: { search },
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    // Incorrect email/password if 401, unknown error otherwise
    if (axios.isAxiosError(error) && error.response && error.response.status === 401) return;
    throw error;
  }
}
