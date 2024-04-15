import axios from 'axios';

export type ProfileInfo = { first_name: string; last_name: string; email_addr: string };

/**
 * get_profile()
 * GET /api/profile endpoint
 * @returns profile info if successful, nothing if unauthenticated
 */
export default async function get_profile(): Promise<ProfileInfo | undefined> {
  try {
    const res = await axios.get('/api/profile');
    return res.data;
  } catch (error) {
    // Incorrect email/password if 401, unknown error otherwise
    if (axios.isAxiosError(error) && error.response && error.response.status === 401) return;
    throw error;
  }
}
