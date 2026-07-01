import { useState } from 'react';
import type { SavingsTransaction } from '../../core';
import { toCentavos } from '../../core';
import { useTrackerStore } from '../../store/trackerStore';
import { Card } from '../../components/Card';
import { MoneyText } from '../../components/MoneyText';
import { NumberField } from '../../components/NumberField';
import { PencilIcon } from '../../components/PencilIcon';

function byNewestFirst(transactions: SavingsTransaction[]): SavingsTransaction[] {
  return [...transactions].sort((a, b) => b.date.localeCompare(a.date));
}

function SavingsRow({
  transaction,
  currency,
}: {
  transaction: SavingsTransaction;
  currency: string;
}) {
  const updateSavings = useTrackerStore((s) => s.updateSavings);
  const removeSavings = useTrackerStore((s) => s.removeSavings);
  const [editing, setEditing] = useState(false);

  const isDeposit = transaction.kind === 'deposit';
  const rowStyle = { borderBottom: '1px solid var(--border)' };

  if (editing) {
    return (
      <li className="flex flex-col gap-2 py-2.5" style={rowStyle}>
        <input
          className="input"
          value={transaction.note ?? ''}
          placeholder={isDeposit ? 'Deposit' : 'Withdrawal'}
          onChange={(event) => updateSavings(transaction.id, { note: event.target.value })}
          aria-label="Transaction note"
        />
        <div className="flex gap-2">
          <div className="input-affix" style={{ flex: 1 }}>
            <span className="affix">{currency}</span>
            <NumberField
              className="affix-input"
              value={transaction.amount}
              onChange={(next) => updateSavings(transaction.id, { amount: next })}
              aria-label="Transaction amount"
            />
          </div>
          <input
            className="input"
            type="date"
            style={{ width: '8.5rem' }}
            value={transaction.date}
            onChange={(event) => updateSavings(transaction.id, { date: event.target.value })}
            aria-label="Transaction date"
          />
          <button type="button" className="ghost-btn" onClick={() => setEditing(false)}>
            Done
          </button>
        </div>
      </li>
    );
  }

  return (
    <li className="flex items-center gap-3 py-2.5" style={rowStyle}>
      <div className="flex min-w-0 flex-col">
        <span className="truncate">{transaction.note ?? (isDeposit ? 'Deposit' : 'Withdrawal')}</span>
        <span className="text-faint text-xs">{transaction.date}</span>
      </div>
      <span
        className={`ml-auto font-medium tabular-nums ${isDeposit ? 'text-success' : 'text-danger'}`}
      >
        {isDeposit ? '+' : '−'}
        <MoneyText centavos={toCentavos(transaction.amount)} currency={currency} />
      </span>
      <button
        type="button"
        className="ghost-btn"
        onClick={() => setEditing(true)}
        aria-label="Edit transaction"
      >
        <PencilIcon />
      </button>
      <button
        type="button"
        className="ghost-btn ghost-btn--danger"
        onClick={() => removeSavings(transaction.id)}
        aria-label="Remove transaction"
      >
        ✕
      </button>
    </li>
  );
}

export function SavingsLedger({
  transactions,
  currency,
}: {
  transactions: SavingsTransaction[];
  currency: string;
}) {
  if (transactions.length === 0) return null;

  return (
    <Card title="History" plain>
      <ul className="flex flex-col">
        {byNewestFirst(transactions).map((transaction) => (
          <SavingsRow key={transaction.id} transaction={transaction} currency={currency} />
        ))}
      </ul>
    </Card>
  );
}
