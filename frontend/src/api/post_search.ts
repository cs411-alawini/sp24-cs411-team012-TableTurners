import axios from 'axios';

/**
 * post_search()
 * POST /api/search endpoint handler
 * @param something idk something
 * @returns idk do something
 */

export type keywordSearch = {
  store_name: string;
  name: string;
  pric: number;
};



export default async function post_search(search: string): Promise<keywordSearch | undefined> {
  try {
    const res = await axios({
      method: 'post',
      url: '/api/search/keyword',
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