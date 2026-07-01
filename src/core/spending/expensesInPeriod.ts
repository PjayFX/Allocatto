import type { Expense, PayPeriod } from '../types';

/** Expenses dated within a pay period's runway: [start, end). The end payday
 *  itself belongs to the next period. ISO "YYYY-MM-DD" strings compare
 *  chronologically, so plain string comparison is correct here. */
export function expensesInPeriod(expenses: Expense[], period: PayPeriod): Expense[] {
  return expenses.filter((expense) => expense.date >= period.start && expense.date < period.end);
}
