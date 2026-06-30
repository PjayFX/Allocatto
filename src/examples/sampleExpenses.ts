import type { Expense } from '../types';

/** Default spend categories (user-configurable; these match the owner's Notion setup). */
export const DEFAULT_CATEGORIES = ['Food', 'Needs', 'Transport', 'Other'] as const;

/** Real transactions from the owner's "March 15 - 31" period (totals ₱2,461.00). */
export const sampleExpenses: Expense[] = [
  { id: 't1', amount: 20, date: '2026-03-16', category: 'Transport', note: 'Tricy pa butas', source: 'manual' },
  { id: 't2', amount: 69, date: '2026-03-16', category: 'Needs', note: 'Corona', source: 'manual' },
  { id: 't3', amount: 600, date: '2026-03-16', category: 'Needs', note: 'Vape', source: 'manual' },
  { id: 't4', amount: 75, date: '2026-03-15', category: 'Food', note: 'Mami', source: 'manual' },
  { id: 't5', amount: 90, date: '2026-03-15', category: 'Food', note: 'Bangsilog', source: 'manual' },
  { id: 't6', amount: 50, date: '2026-03-15', category: 'Food', note: 'Meryenda', source: 'manual' },
  { id: 't7', amount: 112, date: '2026-03-14', category: 'Food', note: 'sinigang', source: 'manual' },
  { id: 't8', amount: 25, date: '2026-03-14', category: 'Food', note: 'Talong', source: 'manual' },
  { id: 't9', amount: 145, date: '2026-03-14', category: 'Other', note: 'Something', source: 'manual' },
  { id: 't10', amount: 150, date: '2026-03-13', category: 'Food', note: 'Meryenda', source: 'manual' },
  { id: 't11', amount: 995, date: '2026-03-13', category: 'Needs', note: 'Grocery', source: 'manual' },
  { id: 't12', amount: 130, date: '2026-03-13', category: 'Food', note: 'veskaa', source: 'manual' },
];
