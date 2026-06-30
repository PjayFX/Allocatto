import type { AllocationResult } from '../types';
import { perDay } from '../calculation';

/**
 * Apply a carryover (centavos; negative = deficit from last period) to an
 * allocation, reducing its allowance and recomputing the per-day rate.
 */
export function applyCarryover(
  allocation: AllocationResult,
  carryInCentavos: number,
): AllocationResult {
  const allowance = allocation.allowance + carryInCentavos;
  return {
    ...allocation,
    allowance,
    perDay: perDay(allowance, allocation.daysInPeriod),
    carriedOver: carryInCentavos,
  };
}
