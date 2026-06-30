import type { CategoryTotal, Expense } from '../types';
import { toCentavos } from '../money';

const UNCATEGORIZED = 'Uncategorized';

/** Sum expenses per category (centavos). Expenses without a category fall under "Uncategorized". */
export function totalsByCategory(expenses: Expense[]): CategoryTotal[] {
  const totals = new Map<string, number>();
  for (const expense of expenses) {
    const category = expense.category ?? UNCATEGORIZED;
    totals.set(category, (totals.get(category) ?? 0) + toCentavos(expense.amount));
  }
  return [...totals].map(([category, amount]) => ({ category, amount }));
}
