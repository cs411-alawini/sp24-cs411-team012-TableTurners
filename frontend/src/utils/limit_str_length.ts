/**
 * limitStrLength()
 * Limits the length of a given string, cutting it off if longer and adding elipsies
 * @param str string to limit length of
 * @param max_len length to limit string to
 * @returns modified string
 */
export default function limitStrLength(str: string, max_len: number) {
  if (str.length > max_len) return `${str.slice(0, max_len)}...`;
  return str;
}
