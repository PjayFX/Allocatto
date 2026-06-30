import { describe, it, expect } from 'vitest';
import { allocateSalary } from '../allocateSalary';
import { summarizeSpending } from './summarizeSpending';
import { toCentavos } from '../money';
import { personalConfig, sampleExpenses } from '../examples';

describe('summarizeSpending — matches the real "March 15 - 31" period', () => {
  // Payslip 15,435.57 -> committed 9,000 -> allowance 6,435.57.
  const allocation = allocateSalary(15435.57, personalConfig);

  it('totals spend, remaining, and percent used', () => {
    const summary = summarizeSpending(allocation, sampleExpenses, { asOf: '2026-03-16' });

    expect(summary.totalSpent).toBe(toCentavos(2461));
    expect(summary.remaining).toBe(toCentavos(3974.57)); // sheet: 3,974.57
    expect(summary.percentUsed).toBe(38); // sheet: 38%
    expect(summary.overspent).toBe(false);
  });

  it('computes today vs the per-day rate', () => {
    const summary = summarizeSpending(allocation, sampleExpenses, { asOf: '2026-03-16' });

    // 2026-03-16: 20 + 69 + 600 = 689 spent today.
    expect(summary.spentToday).toBe(toCentavos(689));
    expect(summary.remainingToday).toBe(allocation.perDay - toCentavos(689));
  });

  it('breaks spend down by category', () => {
    const summary = summarizeSpending(allocation, sampleExpenses, { asOf: '2026-03-16' });
    const byCat = Object.fromEntries(summary.byCategory.map((c) => [c.category, c.amount]));

    expect(byCat['Food']).toBe(toCentavos(632)); // 75+90+50+112+25+150+130
    expect(byCat['Needs']).toBe(toCentavos(1664)); // 69+600+995
    expect(byCat['Transport']).toBe(toCentavos(20));
    expect(byCat['Other']).toBe(toCentavos(145));
  });
});
