/** Whole-number percent of the allowance used. Zero allowance reports 0 (overspend shows via the negative remainder). */
export function percentUsed(totalSpentCentavos: number, allowanceCentavos: number): number {
  if (allowanceCentavos <= 0) {
    return 0;
  }
  return Math.round((totalSpentCentavos / allowanceCentavos) * 100);
}
