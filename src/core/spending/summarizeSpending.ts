import type { AllocationResult, Expense, SpendingSummary, SummarizeOptions } from '../types';
import { todayISO } from '../dates';
import { sumExpenses } from './sumExpenses';
import { totalsByCategory } from './totalsByCategory';
import { percentUsed } from './percentUsed';

/**
 * Summarize what was spent against an allocation's allowance: totals, remaining,
 * percent used, today's figures, and a per-category breakdown. Pure - pass `asOf`
 * for deterministic results.
 */
export function summarizeSpending(
  allocation: AllocationResult,
  expenses: Expense[],
  options: SummarizeOptions = {},
): SpendingSummary {
  const asOf = options.asOf ?? todayISO();
  const totalSpent = sumExpenses(expenses);
  const spentToday = sumExpenses(expenses.filter((expense) => expense.date === asOf));
  const remaining = allocation.allowance - totalSpent;

  return {
    currency: allocation.currency,
    asOf,
    allowance: allocation.allowance,
    perDay: allocation.perDay,
    totalSpent,
    remaining,
    percentUsed: percentUsed(totalSpent, allocation.allowance),
    spentToday,
    remainingToday: allocation.perDay - spentToday,
    byCategory: totalsByCategory(expenses),
    overspent: remaining < 0,
  };
}
