/** Per-day spend rate: the allowance spread across the period's days, in centavos. */
export function perDay(allowanceCentavos: number, daysInPeriod: number): number {
  if (daysInPeriod <= 0) {
    return 0;
  }
  return Math.round(allowanceCentavos / daysInPeriod);
}
