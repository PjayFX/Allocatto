import type { SavingsTransaction } from '../types';
import { toCentavos } from '../money';

/** Running balance (centavos): deposits add, withdrawals subtract. */
export function savingsBalance(transactions: SavingsTransaction[]): number {
  return transactions.reduce((balance, txn) => {
    const amount = toCentavos(txn.amount);
    return txn.kind === 'deposit' ? balance + amount : balance - amount;
  }, 0);
}
