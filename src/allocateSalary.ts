import type { AllocateOptions, AllocationConfig, AllocationResult } from './types';
import { toCentavos } from './money';
import { allocateBuckets, perDay } from './calculation';
import { validateConfig } from './validation';

const DEFAULT_DAYS_IN_PERIOD = 15;

/**
 * Allocate a salary across its buckets. Whatever is left over is the spendable
 * allowance, also expressed as a per-day rate. Pure and never throws - invalid
 * configs come back with `valid: false` and the offending issues listed.
 */
export function allocateSalary(
  salary: number,
  config: AllocationConfig,
  options: AllocateOptions = {},
): AllocationResult {
  const salaryCentavos = toCentavos(salary);
  const daysInPeriod = options.daysInPeriod ?? DEFAULT_DAYS_IN_PERIOD;

  const issues = validateConfig(config, salaryCentavos);
  const allocations = allocateBuckets(config.buckets, salaryCentavos);
  const totalCommitted = allocations.reduce((sum, a) => sum + a.amount, 0);
  const allowance = salaryCentavos - totalCommitted;

  return {
    currency: config.currency,
    salary: salaryCentavos,
    allocations,
    totalCommitted,
    allowance,
    perDay: perDay(allowance, daysInPeriod),
    daysInPeriod,
    valid: issues.every((issue) => issue.severity !== 'error'),
    issues,
  };
}
