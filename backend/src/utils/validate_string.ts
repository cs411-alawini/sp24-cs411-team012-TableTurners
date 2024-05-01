/**
 * validateString()
 * Checks that input is a string and has length less than max length
 * If it is, return string, trimmed if needed
 * If it is not, returns undefined
 * @param input input to valid
 * @param normalize if string should be made lowercase and trimmed
 * @param max_len maximum length of string allowed
 * @returns validated string
 */
export default function validateString(input: any, normalize = false, max_len = Infinity): string | undefined {
  if (typeof input === 'string' || input instanceof String) {
    if (normalize) input = input.toLowerCase().trim();
    if (input.length <= max_len) return input;
  }
  return undefined;
}
