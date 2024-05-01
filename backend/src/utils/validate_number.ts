/**
 * validateNumber()
 * Checks that input is a number and within range
 * If it is, return number
 * If it is not, returns undefined
 * @param input input to valid
 * @param min minimum allowed value (inclusive)
 * @param max maximum allowed value (inclusive)
 * @returns validated number
 */
export default function validateNumber(input: any, min = -Infinity, max = Infinity): number | undefined {
  if (typeof input === 'number') {
    if (min <= input && input <= max) return input;
  }
  return undefined;
}
