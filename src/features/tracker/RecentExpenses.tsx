import { useState } from 'react';
import type { Expense } from '../../core';
import { todayISO } from '../../core';
import { useTrackerStore } from '../../store/trackerStore';
import { Card } from '../../components/Card';
import { ExpenseRow } from './ExpenseRow';

function byNewestFirst(expenses: Expense[]): Expense[] {
  return [...expenses].sort((a, b) => b.date.localeCompare(a.date));
}

function ClearToday({ count }: { count: number }) {
  const clearExpensesOn = useTrackerStore((s) => s.clearExpensesOn);
  const [confirming, setConfirming] = useState(false);
  if (count === 0) return null;

  if (confirming) {
    return (
      <span className="flex items-center gap-2 text-xs">
        <span className="text-faint">Clear {count} today?</span>
        <button
          type="button"
          className="ghost-btn ghost-btn--danger"
          onClick={() => {
            clearExpensesOn(todayISO());
            setConfirming(false);
          }}
        >
          Clear
        </button>
        <button type="button" className="ghost-btn" onClick={() => setConfirming(false)}>
          Cancel
        </button>
      </span>
    );
  }
  return (
    <button type="button" className="ghost-btn text-xs" onClick={() => setConfirming(true)}>
      Clear today
    </button>
  );
}

/** Today's spending only — a fresh sheet each day. Full history lives on the
 *  Dashboard; here the focus is what you've spent so far today. */
export function RecentExpenses({
  expenses,
  currency,
}: {
  expenses: Expense[];
  currency: string;
}) {
  if (expenses.length === 0) {
    return (
      <Card title="Today" plain>
        <p className="text-faint mt-4 text-sm">Nothing logged today yet.</p>
      </Card>
    );
  }

  const rows = byNewestFirst(expenses);

  return (
    <Card title="Today" plain>
      <div className="mb-1 flex items-center justify-between">
        <span className="field-label">{expenses.length} today</span>
        <ClearToday count={expenses.length} />
      </div>
      <ul className="flex flex-col">
        {rows.map((expense, index) => (
          <ExpenseRow
            key={expense.id}
            expense={expense}
            currency={currency}
            divider={index < rows.length - 1}
          />
        ))}
      </ul>
    </Card>
  );
}
