import { useState } from 'react';
import type { Expense } from '../../core';
import { toCentavos } from '../../core';
import { useTrackerStore } from '../../store/trackerStore';
import { MoneyText } from '../../components/MoneyText';
import { NumberField } from '../../components/NumberField';
import { PencilIcon } from '../../components/PencilIcon';
import { CategoryIcon } from './CategoryIcon';

/** A single logged expense with inline edit + remove. Shared by "Today" and the
 *  past-day groups so any day's spending is editable in the same way. */
export function ExpenseRow({
  expense,
  currency,
  divider,
}: {
  expense: Expense;
  currency: string;
  divider: boolean;
}) {
  const updateExpense = useTrackerStore((s) => s.updateExpense);
  const removeExpense = useTrackerStore((s) => s.removeExpense);
  const categoryIcons = useTrackerStore((s) => s.categoryIcons);
  const [editing, setEditing] = useState(false);

  const rowStyle = divider ? { borderBottom: '1px solid var(--border)' } : undefined;

  if (editing) {
    return (
      <li className="flex items-center gap-2 py-2.5" style={rowStyle}>
        <input
          className="input min-w-0 flex-1"
          value={expense.note ?? ''}
          placeholder="Note"
          onChange={(event) => updateExpense(expense.id, { note: event.target.value })}
          aria-label="Expense note"
        />
        <div className="input-affix" style={{ width: '7rem' }}>
          <span className="affix">{currency}</span>
          <NumberField
            className="affix-input"
            value={expense.amount}
            onChange={(next) => updateExpense(expense.id, { amount: next })}
            aria-label="Expense amount"
          />
        </div>
        <button
          type="button"
          className="ghost-btn"
          onClick={() => setEditing(false)}
          aria-label="Done editing"
        >
          Done
        </button>
      </li>
    );
  }

  return (
    <li className="flex items-center gap-3 py-2.5" style={rowStyle}>
      {expense.category ? (
        <span className="exp-cat-icon" title={expense.category}>
          <CategoryIcon iconKey={categoryIcons[expense.category]} size={16} />
        </span>
      ) : null}
      <div className="flex min-w-0 flex-col">
        <span className="truncate">{expense.note ?? 'Expense'}</span>
        {expense.category ? <span className="text-faint text-xs">{expense.category}</span> : null}
      </div>
      <span className="ml-auto font-medium tabular-nums">
        <MoneyText centavos={toCentavos(expense.amount)} currency={currency} />
      </span>
      <button
        type="button"
        className="ghost-btn"
        onClick={() => setEditing(true)}
        aria-label="Edit expense"
      >
        <PencilIcon />
      </button>
      <button
        type="button"
        className="ghost-btn ghost-btn--danger"
        onClick={() => removeExpense(expense.id)}
        aria-label="Remove expense"
      >
        ✕
      </button>
    </li>
  );
}
