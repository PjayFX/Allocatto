import type { Expense } from '../types';
import { toCentavos } from '../money';

/** Total of the given expenses, in centavos. */
export function sumExpenses(expenses: Expense[]): number {
  return expenses.reduce((total, expense) => total + toCentavos(expense.amount), 0);
}
