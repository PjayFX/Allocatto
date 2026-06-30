import { describe, it, expect } from 'vitest';
import { allocateSalary } from '../allocateSalary';
import { summarizeSpending } from '../spending';
import { carryoverFor } from './carryoverFor';
import { applyCarryover } from './applyCarryover';
import { toCentavos } from '../money';
import { personalConfig } from '../examples';
import type { Expense } from '../types';

describe('carryover — Jan overspend rolls into Feb', () => {
  // Jan 15-31: allowance 5,740.63; spent 6,080 -> overspent by -339.37.
  const janAllocation = allocateSalary(14740.63, personalConfig);
  const janExpenses: Expense[] = [
    { id: 'jan', amount: 6080, date: '2026-01-20', category: 'Needs', source: 'manual' },
  ];
  const janSummary = summarizeSpending(janAllocation, janExpenses, { asOf: '2026-01-20' });

  it('carries an overspend forward as a negative deficit', () => {
    expect(carryoverFor(janSummary)).toBe(toCentavos(-339.37));
  });

  it('does not carry an underspend', () => {
    const underspent = summarizeSpending(janAllocation, [], { asOf: '2026-01-20' });
    expect(carryoverFor(underspent)).toBe(0);
  });

  it('reduces the next period allowance and per-day rate', () => {
    // Feb 15-29: allowance 5,725.00 before carryover.
    const febAllocation = allocateSalary(14725, personalConfig);
    const carried = applyCarryover(febAllocation, carryoverFor(janSummary));

    expect(carried.allowance).toBe(toCentavos(5385.63)); // 5,725.00 - 339.37
    expect(carried.carriedOver).toBe(toCentavos(-339.37));
    expect(carried.perDay).toBe(35904); // 538563 / 15
  });
});
