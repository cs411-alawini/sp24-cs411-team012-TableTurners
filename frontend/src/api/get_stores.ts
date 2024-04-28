import axios from 'axios';

export type StoreList = Array<string>;

/**
 * get_stores()
 * GET /api/stores endpoint
 * @returns list of stores if successfully fetched, undefined if unauthorized
 */
export default async function get_stores(): Promise<StoreList | undefined> {
  try {
    const res = await axios({ method: 'get', url: '/api/stores', timeout: 2000, withCredentials: true });
    return res.data;
  } catch (error) {
    // Ignore if unauthorized (401), unknown error otherwise
    if (axios.isAxiosError(error) && error.response && error.response.status === 401) return;
    throw error;
  }
}
