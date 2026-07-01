import { useState } from 'react';
import type { KeyboardEvent } from 'react';
import type { CoverFlowItem, CoverFlowLayout } from '../dashboard/CoverFlow';
import { allocateSalary, toCentavos } from '../../core';
import { usePlanStore } from '../../store/planStore';
import { Card } from '../../components/Card';
import { MoneyText } from '../../components/MoneyText';
import { NumberField } from '../../components/NumberField';
import { PencilIcon } from '../../components/PencilIcon';
import { CoverFlow } from '../dashboard/CoverFlow';
import { PaySlide } from './PaySlide';

/** Subtle peek: past pays sit far out at a soft angle, faint — just a sliver. */
const PEEK: Partial<CoverFlowLayout> = {
  shift: 52,
  depth: 130,
  angle: 30,
  lift: 12,
  minScale: 0.85,
  nearOpacity: 0.5,
  farOpacity: 0.26,
};

const AMOUNT_STYLE = { fontSize: '2rem', fontWeight: 600 } as const;

/** A "Remove" that asks for confirmation inline before firing. */
function RemoveControl({ onConfirm }: { onConfirm: () => void }) {
  const [confirming, setConfirming] = useState(false);
  if (confirming) {
    return (
      <span className="flex items-center gap-2 text-xs">
        <span className="text-faint">Remove this pay?</span>
        <button
          type="button"
          className="ghost-btn ghost-btn--danger"
          onClick={() => {
            onConfirm();
            setConfirming(false);
          }}
        >
          Remove
        </button>
        <button type="button" className="ghost-btn" onClick={() => setConfirming(false)}>
          Cancel
        </button>
      </span>
    );
  }
  return (
    <button type="button" className="ghost-btn text-xs" onClick={() => setConfirming(true)}>
      Remove
    </button>
  );
}

type Mode = 'view' | 'new' | 'edit';

export function PayCarousel() {
  const salary = usePlanStore((s) => s.salary);
  const paidOn = usePlanStore((s) => s.paidOn);
  const config = usePlanStore((s) => s.config);
  const payHistory = usePlanStore((s) => s.payHistory);
  const setSalary = usePlanStore((s) => s.setSalary);
  const logNewSalary = usePlanStore((s) => s.logNewSalary);
  const correctSalary = usePlanStore((s) => s.correctSalary);
  const removePaycheck = usePlanStore((s) => s.removePaycheck);

  const [mode, setMode] = useState<Mode>('view');
  const currency = config.currency;

  function startEntry() {
    logNewSalary();
    setMode('new');
  }

  function commitOnEnter(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      event.preventDefault();
      event.currentTarget.blur();
      setMode('view');
    }
  }

  const currentResult = allocateSalary(salary, config, { paidOn: paidOn || undefined });
  const editing = mode !== 'view';

  const currentAmount = editing ? (
    <NumberField
      value={salary}
      onChange={mode === 'new' ? setSalary : correctSalary}
      className="input"
      style={AMOUNT_STYLE}
      aria-label="Salary"
      autoFocus
      onKeyDown={commitOnEnter}
      onBlur={() => setMode('view')}
    />
  ) : salary > 0 ? (
    <span className="flex items-center gap-2">
      <MoneyText
        centavos={toCentavos(salary)}
        currency={currency}
        className="tabular-nums"
        style={AMOUNT_STYLE}
      />
      <button
        type="button"
        className="ghost-btn"
        onClick={() => setMode('edit')}
        aria-label="Edit salary"
      >
        <PencilIcon />
      </button>
    </span>
  ) : (
    <span className="text-faint text-sm">No salary logged yet.</span>
  );

  const currentFooter = editing ? undefined : (
    <div className="mt-4 flex items-center justify-between gap-3">
      <button type="button" onClick={startEntry} className="btn btn-soft">
        Log new salary
      </button>
      {salary > 0 ? <RemoveControl onConfirm={() => correctSalary(0)} /> : null}
    </div>
  );

  const currentNode = (
    <PaySlide
      label={`Salary (${currency})`}
      subtitle={paidOn}
      amount={currentAmount}
      result={currentResult}
      currency={currency}
      footer={currentFooter}
      showBreakdown={false}
    />
  );

  // A single pay has nothing to peek at — keep it a plain boxed card.
  if (payHistory.length === 0) {
    return <Card title="This pay">{currentNode}</Card>;
  }

  // Oldest → newest so swiping left walks back in time; the current pay sits
  // last and starts centered.
  const pastAsc = [...payHistory].sort((a, b) => a.date.localeCompare(b.date));
  const items: CoverFlowItem[] = [
    ...pastAsc.map((pay) => ({
      id: pay.id,
      node: (
        <PaySlide
          label={`Salary (${currency})`}
          subtitle={pay.date}
          amount={
            <MoneyText
              centavos={toCentavos(pay.amount)}
              currency={currency}
              className="tabular-nums"
              style={AMOUNT_STYLE}
            />
          }
          result={allocateSalary(pay.amount, pay.config ?? config, { paidOn: pay.date })}
          currency={currency}
          footer={
            <div className="mt-4 flex justify-end">
              <RemoveControl onConfirm={() => removePaycheck(pay.id)} />
            </div>
          }
        />
      ),
    })),
    { id: 'current', node: currentNode },
  ];

  // Each pay is its own elevated cf-card, so the container stays frameless to
  // avoid a card-within-a-card look.
  return (
    <section className="pay-carousel">
      <h2 className="card__title">This pay</h2>
      <CoverFlow
        key={items.length}
        items={items}
        initial={items.length - 1}
        layout={PEEK}
        className="coverflow--pays"
      />
    </section>
  );
}
