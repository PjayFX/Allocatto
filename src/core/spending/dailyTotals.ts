import type { DailyTotal, Expense, ISODate } from '../types';
import { toCentavos } from '../money';
import { addDays } from '../dates';

/** One spend total per calendar day across [start, end) (centavos), including
 *  zero-spend days so a chart shows a continuous series. */
export function dailyTotals(expenses: Expense[], start: ISODate, end: ISODate): DailyTotal[] {
  const perDay = new Map<string, number>();
  for (const expense of expenses) {
    if (expense.date >= start && expense.date < end) {
      perDay.set(expense.date, (perDay.get(expense.date) ?? 0) + toCentavos(expense.amount));
    }
  }

  const series: DailyTotal[] = [];
  for (let date = start; date < end; date = addDays(date, 1)) {
    series.push({ date, amount: perDay.get(date) ?? 0 });
  }
  return series;
}
