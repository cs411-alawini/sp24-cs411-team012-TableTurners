/**
 * validateBool()
 * Checks that input is a boolean
 * If it is, return boolean
 * If it is not, returns undefined
 * @param input input to valid
 * @returns validated boolean
 */
export default function validateBool(input: any): boolean | undefined {
  if (typeof input === 'boolean') return input;
  return undefined;
}
