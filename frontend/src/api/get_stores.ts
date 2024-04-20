import axios from 'axios';

/**
 * get_stores()
 * GET /api/stores endpoint
 * @returns idk something
 */
export default async function get_stores(): Promise<void> {
  try {
    //
  } catch (error) {
    // Ignore if unauthorized (401), unknown error otherwise
    if (axios.isAxiosError(error) && error.response && error.response.status === 401) return;
    throw error;
  }

  return;
}
