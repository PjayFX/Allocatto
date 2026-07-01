import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Expense, SavedItem, SavingsKind, SavingsTransaction } from '../core';
import { todayISO } from '../core';

/** Clean starter categories so the picker isn't empty on first use. */
const defaultCategories = ['Food', 'Needs', 'Transport', 'Other'];

/** Starter icons for the default categories (keys from the category icon set). */
const defaultCategoryIcons: Record<string, string> = {
  Food: 'food',
  Needs: 'basket',
  Transport: 'transport',
  Other: 'tag',
};

/** No sample quick items ship — they grow automatically from your own spending
 *  the first time you log an expense with a name + category. */
const defaultSavedItems: SavedItem[] = [];

interface NewExpense {
  amount: number;
  category?: string;
  note?: string;
  /** Defaults to today. */
  date?: string;
}

type ExpensePatch = Partial<Pick<Expense, 'amount' | 'note' | 'category' | 'date'>>;

interface NewSavedItem {
  label: string;
  amount: number;
  category: string;
}

interface NewSavings {
  amount: number;
  kind: SavingsKind;
  note?: string;
  date?: string;
}

type SavingsPatch = Partial<Pick<SavingsTransaction, 'amount' | 'note' | 'date' | 'kind'>>;

interface TrackerState {
  expenses: Expense[];
  savedItems: SavedItem[];
  categories: string[];
  /** Category name → icon key (from the category icon set). Names not present
   *  fall back to a default glyph. Kept as a map so implicit categories (those
   *  that exist only via a saved item) can carry an icon too. */
  categoryIcons: Record<string, string>;
  savings: SavingsTransaction[];
  addExpense: (expense: NewExpense) => void;
  updateExpense: (id: string, patch: ExpensePatch) => void;
  removeExpense: (id: string) => void;
  clearExpensesOn: (date: string) => void;
  logSavedItem: (id: string) => void;
  addSavedItem: (item: NewSavedItem) => void;
  updateSavedItem: (id: string, patch: Partial<NewSavedItem>) => void;
  removeSavedItem: (id: string) => void;
  addCategory: (name: string, icon?: string) => void;
  setCategoryIcon: (name: string, icon: string) => void;
  renameCategory: (from: string, to: string) => void;
  removeCategory: (name: string) => void;
  addSavings: (transaction: NewSavings) => void;
  updateSavings: (id: string, patch: SavingsPatch) => void;
  removeSavings: (id: string) => void;
}

/** True when a saved item with the same label + category already exists (case-
 *  insensitive) — used so auto-grow never piles up duplicates. */
function alreadySaved(items: SavedItem[], label: string, category: string): boolean {
  const key = (item: Pick<SavedItem, 'label' | 'category'>) =>
    `${item.label.trim().toLowerCase()}|${item.category.trim().toLowerCase()}`;
  return items.some((item) => key(item) === key({ label, category }));
}

/** A logged expense with a name + category becomes a reusable saved item so it
 *  can be one-tapped next time. Editing that item later never touches past
 *  expenses, since each expense keeps its own amount snapshot. */
function growSavedItems(items: SavedItem[], expense: Expense): SavedItem[] {
  const label = expense.note?.trim();
  const category = expense.category?.trim();
  if (!label || !category || alreadySaved(items, label, category)) return items;
  return [...items, { id: crypto.randomUUID(), label, amount: expense.amount, category }];
}

export const useTrackerStore = create<TrackerState>()(
  persist(
    (set, get) => ({
      expenses: [],
      savedItems: defaultSavedItems,
      categories: defaultCategories,
      categoryIcons: defaultCategoryIcons,
      savings: [],
      addExpense: ({ amount, category, note, date }) =>
        set((state) => {
          const expense: Expense = {
            id: crypto.randomUUID(),
            amount,
            date: date ?? todayISO(),
            category: category?.trim() || undefined,
            note: note?.trim() || undefined,
            source: 'manual',
          };
          return {
            expenses: [...state.expenses, expense],
            savedItems: growSavedItems(state.savedItems, expense),
          };
        }),
      updateExpense: (id, patch) =>
        set((state) => ({
          expenses: state.expenses.map((expense) =>
            expense.id === id ? { ...expense, ...patch } : expense,
          ),
        })),
      removeExpense: (id) =>
        set((state) => ({ expenses: state.expenses.filter((expense) => expense.id !== id) })),
      clearExpensesOn: (date) =>
        set((state) => ({ expenses: state.expenses.filter((expense) => expense.date !== date) })),
      logSavedItem: (id) => {
        const item = get().savedItems.find((saved) => saved.id === id);
        if (!item) return;
        get().addExpense({ amount: item.amount, category: item.category, note: item.label });
      },
      addSavedItem: ({ label, amount, category }) =>
        set((state) => ({
          savedItems: [...state.savedItems, { id: crypto.randomUUID(), label, amount, category }],
        })),
      updateSavedItem: (id, patch) =>
        set((state) => ({
          savedItems: state.savedItems.map((item) =>
            item.id === id ? { ...item, ...patch } : item,
          ),
        })),
      removeSavedItem: (id) =>
        set((state) => ({ savedItems: state.savedItems.filter((item) => item.id !== id) })),
      addCategory: (name, icon) =>
        set((state) => {
          const trimmed = name.trim();
          const exists = state.categories.some(
            (category) => category.toLowerCase() === trimmed.toLowerCase(),
          );
          if (!trimmed || exists) return {};
          return {
            categories: [...state.categories, trimmed],
            categoryIcons: icon
              ? { ...state.categoryIcons, [trimmed]: icon }
              : state.categoryIcons,
          };
        }),
      setCategoryIcon: (name, icon) =>
        set((state) => ({ categoryIcons: { ...state.categoryIcons, [name]: icon } })),
      // Renaming cascades to saved items (future logs) and past expenses so
      // reporting stays coherent; the pill order is preserved and any resulting
      // duplicate name collapses onto the first (case-insensitive) match.
      renameCategory: (from, to) =>
        set((state) => {
          const target = to.trim();
          if (!target || target === from) return {};
          const renamed = state.categories.map((category) =>
            category === from ? target : category,
          );
          const categories = renamed.filter(
            (category, index) =>
              renamed.findIndex((other) => other.toLowerCase() === category.toLowerCase()) === index,
          );
          const { [from]: movedIcon, ...restIcons } = state.categoryIcons;
          return {
            categories,
            categoryIcons: movedIcon ? { ...restIcons, [target]: movedIcon } : restIcons,
            savedItems: state.savedItems.map((item) =>
              item.category === from ? { ...item, category: target } : item,
            ),
            expenses: state.expenses.map((expense) =>
              expense.category === from ? { ...expense, category: target } : expense,
            ),
          };
        }),
      // Removing a category drops its quick items too; past expenses keep their
      // label so history/dashboards stay intact.
      removeCategory: (name) =>
        set((state) => {
          const categoryIcons = { ...state.categoryIcons };
          delete categoryIcons[name];
          return {
            categories: state.categories.filter((category) => category !== name),
            categoryIcons,
            savedItems: state.savedItems.filter((item) => item.category !== name),
          };
        }),
      addSavings: ({ amount, kind, note, date }) =>
        set((state) => ({
          savings: [
            ...state.savings,
            {
              id: crypto.randomUUID(),
              amount,
              kind,
              date: date ?? todayISO(),
              note: note?.trim() || undefined,
            },
          ],
        })),
      updateSavings: (id, patch) =>
        set((state) => ({
          savings: state.savings.map((transaction) =>
            transaction.id === id
              ? {
                  ...transaction,
                  ...patch,
                  note: 'note' in patch ? patch.note?.trim() || undefined : transaction.note,
                }
              : transaction,
          ),
        })),
      removeSavings: (id) =>
        set((state) => ({ savings: state.savings.filter((transaction) => transaction.id !== id) })),
    }),
    {
      name: 'allocato-tracker',
      version: 2,
      // v2 introduced per-category icons; older data simply starts iconless
      // (categories then fall back to a default glyph).
      migrate: (persisted, version) => {
        const state = persisted as TrackerState;
        if (version < 2 && !state.categoryIcons) state.categoryIcons = {};
        return state;
      },
    },
  ),
);
