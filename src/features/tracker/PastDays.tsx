import { useState } from 'react';
import type { ExpenseDay } from '../../core';
import { addDays, todayISO } from '../../core';
import { Card } from '../../components/Card';
import { MoneyText } from '../../components/MoneyText';
import { ExpenseRow } from './ExpenseRow';

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      className={`rec-chevron${open ? ' rec-chevron--open' : ''}`}
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}

/** Friendly heading for a past day: "Yesterday" when it is, else the date. */
function dayLabel(date: string): string {
  return date === addDays(todayISO(), -1) ? 'Yesterday' : date;
}

function DayGroup({ day, currency }: { day: ExpenseDay; currency: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rec-group">
      <button
        type="button"
        className="rec-group__head"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span className="rec-group__name">
          {dayLabel(day.date)}
          <span className="text-faint ml-2 text-xs">{day.expenses.length}</span>
        </span>
        <span className="flex items-center gap-2.5">
          <span className="font-medium tabular-nums">
            <MoneyText centavos={day.total} currency={currency} />
          </span>
          <Chevron open={open} />
        </span>
      </button>

      {open ? (
        <ul className="flex flex-col pb-1">
          {day.expenses.map((expense, index) => (
            <ExpenseRow
              key={expense.id}
              expense={expense}
              currency={currency}
              divider={index < day.expenses.length - 1}
            />
          ))}
        </ul>
      ) : null}
    </div>
  );
}

/** Earlier days of this pay period as collapsible groups — tap a day to reveal
 *  and edit what was logged then. */
export function PastDays({ days, currency }: { days: ExpenseDay[]; currency: string }) {
  if (days.length === 0) return null;

  return (
    <Card title="Earlier this pay" plain>
      <div className="rec-groups">
        {days.map((day) => (
          <DayGroup key={day.date} day={day} currency={currency} />
        ))}
      </div>
    </Card>
  );
}
