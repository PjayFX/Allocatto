import type { SavingsPoint, SavingsTransaction } from '../types';
import { toCentavos } from '../money';

/** Cumulative balance after each transaction, in date order (centavos). */
export function savingsTimeline(transactions: SavingsTransaction[]): SavingsPoint[] {
  let balance = 0;
  return [...transactions]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((txn) => {
      balance += txn.kind === 'deposit' ? toCentavos(txn.amount) : -toCentavos(txn.amount);
      return { date: txn.date, balance };
    });
}
