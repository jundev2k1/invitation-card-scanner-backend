export const formatToTsQuery = (rawInput: string): string => {
  if (!rawInput) return '';

  return rawInput
    .trim()
    .split(/\s+/)
    .map(word => `${word}:*`)
    .join(' | ');
}
