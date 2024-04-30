import axios from 'axios';

export type KeywordSearchResult = {
  store_name: string;
  name: string;
  price: number;
};
export type KeywordSearchResults = Array<KeywordSearchResult>;

/**
 * post_search()
 * POST /api/search endpoint handler
 * @param something idk something
 * @returns idk do something
 */
export default async function post_search(search: string): Promise<KeywordSearchResults | undefined> {
  try {
    const res = await axios({
      method: 'post',
      url: '/api/search',
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
