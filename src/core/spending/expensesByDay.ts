import type { Expense, ISODate } from '../types';
import { toCentavos } from '../money';

/** All expenses logged on one calendar day, with that day's total in centavos. */
export interface ExpenseDay {
  date: ISODate;
  expenses: Expense[];
  total: number;
}

/** Group expenses into per-day buckets, newest day first and — within a day —
 *  most-recently-logged first. Days with no expenses are omitted. */
export function expensesByDay(expenses: Expense[]): ExpenseDay[] {
  const byDate = new Map<string, Expense[]>();
  for (const expense of expenses) {
    const list = byDate.get(expense.date) ?? [];
    list.unshift(expense);
    byDate.set(expense.date, list);
  }
  return [...byDate.entries()]
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([date, list]) => ({
      date,
      expenses: list,
      total: list.reduce((sum, expense) => sum + toCentavos(expense.amount), 0),
    }));
}
