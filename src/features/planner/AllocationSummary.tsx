import type { AllocationResult } from '../../core';
import { Card } from '../../components/Card';
import { MoneyText } from '../../components/MoneyText';
import { bucketColor, ALLOWANCE_COLOR } from './bucketColors';

interface Segment {
  key: string;
  label: string;
  amount: number;
  color: string;
  width: number;
  isAllowance: boolean;
}

function buildSegments(result: AllocationResult): Segment[] {
  const denom = Math.max(result.salary, result.totalCommitted, 1);
  const buckets = result.allocations.map((allocation, index) => ({
    key: allocation.bucket.id,
    label: allocation.bucket.name,
    amount: allocation.amount,
    color: bucketColor(index),
    width: (allocation.amount / denom) * 100,
    isAllowance: false,
  }));
  if (result.allowance <= 0) return buckets;
  return [
    ...buckets,
    {
      key: '__allowance',
      label: 'Allowance',
      amount: result.allowance,
      color: ALLOWANCE_COLOR,
      width: (result.allowance / denom) * 100,
      isAllowance: true,
    },
  ];
}

function percentOfSalary(amount: number, salary: number): number {
  return salary > 0 ? Math.round((amount / salary) * 100) : 0;
}

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
          <div className="text-sm tabular-nums">
            <MoneyText centavos={result.perDay} currency={currency} />{' '}
            <span className="text-faint">/ day</span>
          </div>
          <div className="text-faint text-xs">
            {result.daysInPeriod} days
            {result.period ? ` · ${result.period.start} → ${result.period.end}` : ''}
          </div>
        </div>
      </div>

      <div
        className="mt-4 flex h-2.5 w-full overflow-hidden rounded-full"
        style={{ background: 'var(--surface-3)' }}
      >
        {segments.map((segment) => (
          <span key={segment.key} style={{ width: `${segment.width}%`, background: segment.color }} />
        ))}
      </div>

      <ul className="mt-4 flex flex-col gap-2.5">
        {segments.map((segment) => (
          <li key={segment.key} className="flex items-center gap-2.5 text-sm">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: segment.color }} />
            <span className={segment.isAllowance ? 'text-success' : undefined}>{segment.label}</span>
            <span className="text-faint text-xs tabular-nums">
              {percentOfSalary(segment.amount, salary)}%
            </span>
            <span className="ml-auto font-medium tabular-nums">
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
