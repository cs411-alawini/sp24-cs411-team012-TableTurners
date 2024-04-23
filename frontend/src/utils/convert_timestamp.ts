/**
 * convertTimestamp()
 * Converts timestamp to human readable format
 * @param timestamp ISO 8601 timestamp string
 * @returns Human friendly timestamp string
 */
export function convertTimestamp(timestamp: string) {
  const format_config: Intl.DateTimeFormatOptions = {
    year: '2-digit',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  };
  return new Date(timestamp).toLocaleDateString(undefined, format_config);
}
