// Shared palette so the bucket editor dots and the allocation bar/legend match.
export const BUCKET_COLORS = [
  '#4d8dff',
  '#ffb454',
  '#ff6b81',
  '#a78bfa',
  '#22d3ee',
  '#f472b6',
  '#9aa0ff',
  '#fbbf24',
];

/** Green — the spendable allowance, matching the hero number. */
export const ALLOWANCE_COLOR = '#46c08a';

export function bucketColor(index: number): string {
  return BUCKET_COLORS[index % BUCKET_COLORS.length] ?? ALLOWANCE_COLOR;
}
