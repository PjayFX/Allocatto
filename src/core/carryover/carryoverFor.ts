import type { SpendingSummary } from '../types';

/**
 * Amount to carry into the next period, in centavos. An overspend carries as a
 * negative deficit; an underspend does not carry (each period starts fresh).
 */
export function carryoverFor(summary: SpendingSummary): number {
  return summary.remaining < 0 ? summary.remaining : 0;
}
