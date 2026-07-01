import type { SpendingSummary } from '../../core';
import { Card } from '../../components/Card';
import { MoneyText } from '../../components/MoneyText';

type Tone = 'success' | 'warning' | 'danger';

/** Green while healthy, amber once the remainder dips under 40% of its
 *  reference (per-day for today, allowance for the pay), red when negative. */
const WARNING_RATIO = 0.4;

function toneFor(value: number, reference: number): Tone {
  if (value < 0) return 'danger';
  if (reference > 0 && value / reference < WARNING_RATIO) return 'warning';
  return 'success';
}

const TONE_VAR: Record<Tone, string> = {
  success: 'var(--success)',
  warning: 'var(--warning)',
  danger: 'var(--danger)',
};

export function SpendingSummaryCard({
  summary,
  hasSalary,
}: {
  summary: SpendingSummary;
  hasSalary: boolean;
}) {
  const { currency } = summary;
  const usedWidth = Math.min(summary.percentUsed, 100);
  const barTone = TONE_VAR[toneFor(summary.remaining, summary.allowance)];
  const todayTone = TONE_VAR[toneFor(summary.remainingToday, summary.perDay)];
  const payColor = summary.remaining < 0 ? 'var(--danger)' : 'var(--text-muted)';

  return (
    <Card title="Allowance">
      <div className="flex items-end justify-between gap-4">
        <div className="flex flex-col">
          <span className="field-label">Left today</span>
          <MoneyText
            centavos={summary.remainingToday}
            currency={currency}
            className="hero-amount tabular-nums"
            style={{ color: todayTone }}
          />
        </div>
        <div className="flex flex-col items-end text-right">
          <span className="field-label">Left this pay</span>
          <MoneyText
            centavos={summary.remaining}
            currency={currency}
            className="tabular-nums text-sm font-medium"
            style={{ color: payColor }}
          />
        </div>
      </div>

      {hasSalary ? (
        <>
          <div
            className="mt-4 flex h-2.5 w-full overflow-hidden rounded-full"
            style={{ background: 'var(--surface-3)' }}
          >
            <span style={{ width: `${usedWidth}%`, background: barTone }} />
          </div>
          <div className="text-faint mt-2 flex items-center justify-between text-xs tabular-nums">
            <span>
              <MoneyText centavos={summary.totalSpent} currency={currency} /> spent
            </span>
            <span>
              {summary.percentUsed}% of{' '}
              <MoneyText centavos={summary.allowance} currency={currency} />
            </span>
          </div>
          <div className="text-faint mt-1 text-xs tabular-nums">
            <MoneyText centavos={summary.perDay} currency={currency} /> / day
          </div>
        </>
      ) : (
        <p className="text-faint mt-3 text-sm">
          Log your salary in the Planner to see how much you can spend.
        </p>
      )}

      {summary.byCategory.length > 0 ? (
        <ul className="mt-4 flex flex-col gap-2">
          {summary.byCategory.map((entry) => (
            <li key={entry.category} className="flex items-center gap-2.5 text-sm">
              <span>{entry.category}</span>
              <span className="ml-auto font-medium tabular-nums">
                <MoneyText centavos={entry.amount} currency={currency} />
              </span>
            </li>
          ))}
        </ul>
      ) : null}
    </Card>
  );
}
