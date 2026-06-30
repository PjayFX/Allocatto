import type { SavingsKind, SavingsSummary, SavingsTransaction } from '../types';
import { toCentavos } from '../money';
import { savingsBalance } from './savingsBalance';

function totalOfKind(transactions: SavingsTransaction[], kind: SavingsKind): number {
  return transactions
    .filter((txn) => txn.kind === kind)
    .reduce((total, txn) => total + toCentavos(txn.amount), 0);
}

/** Summarize savings: running balance plus total deposits and withdrawals (centavos). */
export function summarizeSavings(transactions: SavingsTransaction[]): SavingsSummary {
  return {
    balance: savingsBalance(transactions),
    totalDeposits: totalOfKind(transactions, 'deposit'),
    totalWithdrawals: totalOfKind(transactions, 'withdrawal'),
  };
}
