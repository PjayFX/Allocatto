import { describe, it, expect } from 'vitest';
import { allocateSalary } from './allocateSalary';
import { formatMoney, toCentavos } from './money';
import { personalConfig, percentageConfig } from './examples';

describe('allocateSalary — matches the real Notion sheet', () => {
  it('May 1 - 15: ₱15,601.98 -> committed ₱9,000, allowance ₱6,601.98, per day ₱440.13', () => {
    const result = allocateSalary(15601.98, personalConfig);

    expect(result.valid).toBe(true);
    expect(result.totalCommitted).toBe(toCentavos(9000));
    expect(result.allowance).toBe(660198);
    expect(result.perDay).toBe(44013);
    expect(formatMoney(result.perDay, 'PHP')).toContain('440.13');
  });

  it('January 15 - 31: ₱14,740.63 -> allowance ₱5,740.63, per day ₱382.71', () => {
    const result = allocateSalary(14740.63, personalConfig);

    expect(result.allowance).toBe(574063);
    expect(result.perDay).toBe(38271);
  });

  it('supports percentage buckets (percent of salary)', () => {
    // savings 20% = 4,000, rent 30% = 6,000, food 4,000 -> committed 14,000, allowance 6,000
    const result = allocateSalary(20000, percentageConfig);

    expect(result.totalCommitted).toBe(toCentavos(14000));
    expect(result.allowance).toBe(toCentavos(6000));
  });

  it('flags committed > salary without throwing, and shows a negative allowance', () => {
    const result = allocateSalary(8000, personalConfig); // committed 9,000 > 8,000

    expect(result.valid).toBe(false);
    expect(result.allowance).toBe(toCentavos(-1000));
    expect(result.issues.some((issue) => issue.code === 'committed_over_salary')).toBe(true);
  });
});
