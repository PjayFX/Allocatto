// Committed buckets render in monochrome greys so the one accent (green, used for
// the spendable allowance) is the only colour that carries meaning.
export const BUCKET_COLORS = [
  '#b7b7bf',
  '#8f8f97',
  '#6d6d75',
  '#525258',
  '#a3a3ab',
  '#414146',
  '#7d7d85',
  '#606067',
];

/** Light grey — the spendable allowance segment/dot. Kept monochrome like the
 *  buckets; green is reserved for the headline allowance figure, not the chart. */
export const ALLOWANCE_COLOR = '#d0d0d8';

export function bucketColor(index: number): string {
  return BUCKET_COLORS[index % BUCKET_COLORS.length] ?? ALLOWANCE_COLOR;
}
