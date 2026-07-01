import { useMemo, useState } from 'react';
import { summarizeSavings } from '../../core';
import { usePlanStore } from '../../store/planStore';
import { useTrackerStore } from '../../store/trackerStore';
import { Card } from '../../components/Card';
import { MoneyText } from '../../components/MoneyText';
import { SavingsForm } from './SavingsForm';
import { SavingsLedger } from './SavingsLedger';

export default function SavingsPage() {
  const currency = usePlanStore((s) => s.config.currency);
  const savings = useTrackerStore((s) => s.savings);
  const summary = useMemo(() => summarizeSavings(savings), [savings]);
  const [adding, setAdding] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <Card title="Savings">
        <div className="flex flex-col">
          <span className="field-label">Balance</span>
          <MoneyText
            centavos={summary.balance}
            currency={currency}
            className="hero-amount tabular-nums text-success"
          />
        </div>
        <div className="text-faint mt-3 flex items-center justify-between text-xs tabular-nums">
          <span>
            <MoneyText centavos={summary.totalDeposits} currency={currency} /> in
          </span>
          <span>
            <MoneyText centavos={summary.totalWithdrawals} currency={currency} /> out
          </span>
        </div>
        <div className="mt-4">
          {adding ? (
            <SavingsForm onDone={() => setAdding(false)} />
          ) : (
            <button type="button" className="btn-add" onClick={() => setAdding(true)}>
              + Add transaction
            </button>
          )}
        </div>
      </Card>

      <SavingsLedger transactions={savings} currency={currency} />
    </div>
  );
}
