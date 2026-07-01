import { useState } from 'react';
import { useTrackerStore } from '../../store/trackerStore';
import { usePlanStore } from '../../store/planStore';
import { NumberField } from '../../components/NumberField';

export function SavingsForm({ onDone }: { onDone?: () => void }) {
  const addSavings = useTrackerStore((s) => s.addSavings);
  const currency = usePlanStore((s) => s.config.currency);
  const [amount, setAmount] = useState(0);
  const [note, setNote] = useState('');

  function submit(kind: 'deposit' | 'withdrawal') {
    if (amount <= 0) return;
    addSavings({ amount, kind, note });
    setAmount(0);
    setNote('');
    onDone?.();
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <div className="input-affix flex-1">
          <span className="affix">{currency}</span>
          <NumberField
            className="affix-input"
            value={amount}
            onChange={setAmount}
            aria-label="Savings amount"
          />
        </div>
        <input
          className="input"
          style={{ width: '10rem' }}
          placeholder="Note (optional)"
          value={note}
          onChange={(event) => setNote(event.target.value)}
          aria-label="Savings note"
        />
      </div>
      <div className="flex gap-2">
        <button type="button" className="btn btn-primary flex-1" onClick={() => submit('deposit')}>
          Deposit
        </button>
        <button type="button" className="btn btn-soft flex-1" onClick={() => submit('withdrawal')}>
          Withdraw
        </button>
      </div>
      {onDone ? (
        <button type="button" className="ghost-btn self-center" onClick={onDone}>
          Cancel
        </button>
      ) : null}
    </div>
  );
}
