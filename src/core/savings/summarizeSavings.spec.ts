import { describe, it, expect } from 'vitest';
import { summarizeSavings } from './summarizeSavings';
import { toCentavos } from '../money';
import { sampleSavings } from '../examples';

describe('summarizeSavings', () => {
  it('nets deposits against withdrawals into a running balance', () => {
    const summary = summarizeSavings(sampleSavings);

    expect(summary.totalDeposits).toBe(toCentavos(10000));
    expect(summary.totalWithdrawals).toBe(toCentavos(2000));
    expect(summary.balance).toBe(toCentavos(8000));
  });
});
