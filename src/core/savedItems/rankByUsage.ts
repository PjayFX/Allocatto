import type { Expense, SavedItem } from '../types';

/** Match key so a saved item lines up with the expenses it spawned/matches. */
function usageKey(label: string, category: string): string {
  return `${label.trim().toLowerCase()}|${category.trim().toLowerCase()}`;
}

interface Usage {
  count: number;
  lastUsed: string;
}

/** Rank saved items by how often they're actually logged (then by recency),
 *  so the "usually what we spend on" items float to the top. Usage is derived
 *  from expense history — no extra counters to persist. */
export function rankSavedItemsByUsage(items: SavedItem[], expenses: Expense[]): SavedItem[] {
  const usage = new Map<string, Usage>();
  for (const expense of expenses) {
    if (!expense.note || !expense.category) continue;
    const key = usageKey(expense.note, expense.category);
    const prev = usage.get(key) ?? { count: 0, lastUsed: '' };
    usage.set(key, {
      count: prev.count + 1,
      lastUsed: expense.date > prev.lastUsed ? expense.date : prev.lastUsed,
    });
  }

  return items
    .map((item, index) => ({
      item,
      index,
      use: usage.get(usageKey(item.label, item.category)) ?? { count: 0, lastUsed: '' },
    }))
    .sort(
      (a, b) =>
        b.use.count - a.use.count ||
        b.use.lastUsed.localeCompare(a.use.lastUsed) ||
        a.index - b.index,
    )
    .map((entry) => entry.item);
}
