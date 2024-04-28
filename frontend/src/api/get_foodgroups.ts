import axios from 'axios';

export type FoodGroups = Array<string>;

/**
 * get_foodgroups()
 * GET /api/foodgroups endpoint
 * @returns list of food groups if successfully fetched, undefined if unauthorized
 */
export default async function get_foodgroups(): Promise<FoodGroups | undefined> {
  try {
    const res = await axios({ method: 'get', url: '/api/foodgroups', timeout: 2000, withCredentials: true });
    return res.data;
  } catch (error) {
    // Ignore if unauthorized (401), unknown error otherwise
    if (axios.isAxiosError(error) && error.response && error.response.status === 401) return;
    throw error;
  }

  return;
}
