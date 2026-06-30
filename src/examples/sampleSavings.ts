import type { SavingsTransaction } from '../types';

/** Sample savings activity: two periods saved, one withdrawal. Balance = ₱8,000.00. */
export const sampleSavings: SavingsTransaction[] = [
  { id: 's1', amount: 5000, date: '2026-03-15', kind: 'deposit', note: 'March 15-31 savings' },
  { id: 's2', amount: 5000, date: '2026-03-31', kind: 'deposit', note: 'next period savings' },
  { id: 's3', amount: 2000, date: '2026-04-02', kind: 'withdrawal', note: 'emergency' },
];
