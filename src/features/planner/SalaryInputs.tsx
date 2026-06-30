import { useState } from 'react';
import type { KeyboardEvent } from 'react';
import { usePlanStore } from '../../store/planStore';
import { Card } from '../../components/Card';
import { NumberField } from '../../components/NumberField';
import { MoneyText } from '../../components/MoneyText';

export function SalaryInputs() {
  const salary = usePlanStore((s) => s.salary);
  const paidOn = usePlanStore((s) => s.paidOn);
  const currency = usePlanStore((s) => s.config.currency);
  const setSalary = usePlanStore((s) => s.setSalary);
  const logNewSalary = usePlanStore((s) => s.logNewSalary);

  const [entering, setEntering] = useState(false);

  function startEntry() {
    logNewSalary();
    setEntering(true);
  }

  function commitOnEnter(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      event.preventDefault();
      event.currentTarget.blur();
      setEntering(false);
    }
  }

  if (entering) {
    return (
      <Card title="This pay">
        <label className="flex flex-col gap-1.5">
          <span className="field-label">Salary ({currency})</span>
          <NumberField
            value={salary}
            onChange={setSalary}
            className="input"
            style={{ fontSize: '1.6rem', fontWeight: 600 }}
            aria-label="Salary"
            autoFocus
            onKeyDown={commitOnEnter}
          />
        </label>
        <p className="text-faint mt-2.5 text-xs">{paidOn}</p>
      </Card>
    );
  }

  return (
    <Card title="This pay">
      {salary > 0 ? (
        <div className="flex items-end justify-between gap-3">
          <div className="flex flex-col">
            <span className="field-label">Salary ({currency})</span>
            <MoneyText
              centavos={Math.round(salary * 100)}
              currency={currency}
              className="tabular-nums"
              style={{ fontSize: '1.6rem', fontWeight: 600 }}
            />
            <span className="text-faint mt-1 text-xs">{paidOn}</span>
          </div>
        </div>
      ) : (
        <p className="text-faint text-sm">No salary logged yet.</p>
      )}
      <button type="button" onClick={startEntry} className="btn btn-soft mt-4 w-full">
        Log new salary
      </button>
    </Card>
  );
}
