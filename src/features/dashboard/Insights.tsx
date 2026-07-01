import type { CategoryTotal, SalaryInsights } from '../../core';
import { formatMoney } from '../../core';
import { Card } from '../../components/Card';
import { MoneyText } from '../../components/MoneyText';

function PayTrend({ latest, previous }: { latest: number; previous: number }) {
  if (previous <= 0) return null;
  const deltaPct = Math.round(((latest - previous) / previous) * 100);
  if (deltaPct === 0) return <span className="text-faint text-xs">no change vs last</span>;
  const up = deltaPct > 0;
  return (
    <span className={`text-xs ${up ? 'text-success' : 'text-danger'}`}>
      {up ? '▲' : '▼'} {Math.abs(deltaPct)}% vs last
    </span>
  );
}

function Stat({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col">
      <span className="field-label">{label}</span>
      <span className="mt-0.5 tabular-nums">{children}</span>
    </div>
  );
}

/** Salary + spending highlights. All money in centavos. */
export function Insights({
  salary,
  topCategory,
  totalSpent,
  currency,
}: {
  salary: SalaryInsights;
  topCategory?: CategoryTotal;
  totalSpent: number;
  currency: string;
}) {
  return (
    <Card title="Insights">
      <div className="flex flex-col">
        <span className="field-label">This pay</span>
        <MoneyText
          centavos={salary.latest}
          currency={currency}
          className="hero-amount tabular-nums"
        />
        {salary.previous !== undefined ? (
          <PayTrend latest={salary.latest} previous={salary.previous} />
        ) : null}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-x-3 gap-y-4">
        <Stat label="Last pay">
          {salary.previous !== undefined ? formatMoney(salary.previous, currency) : '—'}
        </Stat>
        <Stat label={`Average (${salary.count})`}>
          {salary.count > 0 ? formatMoney(salary.average, currency) : '—'}
        </Stat>
        <Stat label="Most spent on">
          {topCategory ? (
            <span className="flex flex-col">
              <span className="truncate">{topCategory.category}</span>
              <span className="text-muted text-sm">{formatMoney(topCategory.amount, currency)}</span>
            </span>
          ) : (
            '—'
          )}
        </Stat>
        <Stat label="Spent this pay">{formatMoney(totalSpent, currency)}</Stat>
      </div>
    </Card>
  );
}
