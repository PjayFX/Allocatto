import type { ReactNode } from 'react';
import type { AllocationResult } from '../../core';
import { MoneyText } from '../../components/MoneyText';
import { AllocationBar } from './AllocationBar';
import { buildSegments } from './allocationSegments';

/** One pay in the carousel: the amount, its date, and (when there's a salary)
 *  the resulting allowance and allocation bar. `amount` is supplied so the
 *  current pay can render an editable field while past pays stay read-only. */
export function PaySlide({
  label,
  subtitle,
  amount,
  result,
  currency,
  footer,
  showBreakdown = true,
}: {
  label: string;
  subtitle: string;
  amount: ReactNode;
  result: AllocationResult;
  currency: string;
  footer?: ReactNode;
  /** The current pay hides its breakdown (it's detailed in the Allocation card
   *  below); past pays show theirs since the carousel is their only home. */
  showBreakdown?: boolean;
}) {
  const hasSalary = result.salary > 0;
  const overspent = result.allowance < 0;
  const breakdown = hasSalary && showBreakdown;
  const segments = buildSegments(result);

  return (
    <div className="pay-slide">
      <div className="flex items-end justify-between gap-3">
        <div className="flex min-w-0 flex-col">
          <span className="field-label">{label}</span>
          {amount}
          <span className="text-faint mt-1 text-xs">{subtitle}</span>
        </div>
        {hasSalary ? (
          <div className="text-right">
            <div className={`text-sm tabular-nums ${overspent ? 'text-danger' : 'text-success'}`}>
              <MoneyText centavos={result.allowance} currency={currency} />
            </div>
            <div className="text-faint text-xs tabular-nums">
              <MoneyText centavos={result.perDay} currency={currency} /> / day
            </div>
          </div>
        ) : null}
      </div>

      {breakdown ? <AllocationBar result={result} /> : null}

      {breakdown ? (
        <ul className="pay-slide__legend">
          {segments.map((segment) => (
            <li key={segment.key} className="flex items-center gap-2 text-xs">
              <span
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ background: segment.color }}
              />
              <span className="text-muted truncate">{segment.label}</span>
              <span className="text-muted ml-auto tabular-nums">
                <MoneyText centavos={segment.amount} currency={currency} />
              </span>
            </li>
          ))}
        </ul>
      ) : null}

      {footer}
    </div>
  );
}
