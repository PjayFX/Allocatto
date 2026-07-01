import type { Expense, LedgerEntry, Paycheck, SavingsTransaction } from '../types';
import { toCentavos } from '../money';

function payEntry(pay: Paycheck): LedgerEntry {
  return {
    id: `pay-${pay.id}`,
    kind: 'pay',
    date: pay.date,
    amount: toCentavos(pay.amount),
    direction: 'in',
    label: 'Pay',
  };
}

function expenseEntry(expense: Expense): LedgerEntry {
  return {
    id: `exp-${expense.id}`,
    kind: 'expense',
    date: expense.date,
    amount: toCentavos(expense.amount),
    direction: 'out',
    label: expense.note ?? expense.category ?? 'Expense',
    sublabel: expense.note ? expense.category : undefined,
  };
}

function savingsEntry(txn: SavingsTransaction): LedgerEntry {
  const isDeposit = txn.kind === 'deposit';
  return {
    id: `sav-${txn.id}`,
    kind: isDeposit ? 'deposit' : 'withdrawal',
    date: txn.date,
    amount: toCentavos(txn.amount),
    direction: isDeposit ? 'out' : 'in',
    label: txn.note ?? (isDeposit ? 'Deposit' : 'Withdrawal'),
    sublabel: 'Savings',
  };
}

/** Every transaction — pays, expenses, savings moves — merged newest-first. */
export function ledgerEntries(
  paychecks: Paycheck[],
  expenses: Expense[],
  savings: SavingsTransaction[],
): LedgerEntry[] {
  return [
    ...paychecks.map(payEntry),
    ...expenses.map(expenseEntry),
    ...savings.map(savingsEntry),
  ].sort((a, b) => b.date.localeCompare(a.date));
}
