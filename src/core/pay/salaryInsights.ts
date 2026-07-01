import type { Paycheck, SalaryInsights } from '../types';
import { toCentavos } from '../money';

/** Latest / previous / average pay across recorded paychecks (centavos).
 *  Empty history yields zeroes so callers can render placeholders. */
export function salaryInsights(paychecks: Paycheck[]): SalaryInsights {
  if (paychecks.length === 0) return { latest: 0, average: 0, count: 0 };

  const amounts = [...paychecks]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((paycheck) => toCentavos(paycheck.amount));
  const total = amounts.reduce((sum, amount) => sum + amount, 0);

  return {
    latest: amounts[amounts.length - 1] ?? 0,
    previous: amounts.length > 1 ? amounts[amounts.length - 2] : undefined,
    average: Math.round(total / amounts.length),
    count: amounts.length,
  };
}
