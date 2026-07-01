import type { AllocationResult } from '../../core';
import { Card } from '../../components/Card';
import { MoneyText } from '../../components/MoneyText';
import { AllocationBar } from './AllocationBar';
import { buildSegments, percentOfSalary } from './allocationSegments';

export function AllocationSummary({ result }: { result: AllocationResult }) {
  const { currency, salary } = result;
  const overspent = result.allowance < 0;
  const segments = buildSegments(result);

  return (
    <Card title="Allocation">
      <div className="flex items-end justify-between gap-3">
        <div className="flex flex-col">
          <span className="field-label">Allowance this pay</span>
          <MoneyText
            centavos={result.allowance}
            currency={currency}
            className={`hero-amount tabular-nums ${overspent ? 'text-danger' : 'text-success'}`}
          />
        </div>
        <div className="text-right">
          <div className="text-muted text-sm tabular-nums">
            <MoneyText centavos={result.perDay} currency={currency} />{' '}
            <span className="text-faint">/ day</span>
          </div>
          <div className="text-faint text-xs">
            {result.daysInPeriod} days
            {result.period ? ` · ${result.period.start} → ${result.period.end}` : ''}
          </div>
        </div>
      </div>

      <AllocationBar result={result} />

      <ul className="mt-4 flex flex-col gap-2.5">
        {segments.map((segment) => (
          <li key={segment.key} className="flex items-center gap-2.5 text-sm">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: segment.color }} />
            <span className="text-muted">{segment.label}</span>
            <span className="text-faint text-xs tabular-nums">
              {percentOfSalary(segment.amount, salary)}%
            </span>
            <span className="text-muted ml-auto tabular-nums">
              <MoneyText centavos={segment.amount} currency={currency} />
            </span>
          </li>
        ))}
      </ul>

      {result.issues.length > 0 ? (
        <ul className="mt-4 flex flex-col gap-1.5">
          {result.issues.map((issue, index) => (
            <li
              key={index}
              className={`text-xs ${issue.severity === 'error' ? 'text-danger' : ''}`}
              style={issue.severity === 'warning' ? { color: 'var(--warning)' } : undefined}
            >
              {issue.message}
            </li>
          ))}
        </ul>
      ) : null}
    </Card>
  );
}
