import type { DailyTotal } from '../../core';
import { formatMoney } from '../../core';

const VIEW_W = 320;
const VIEW_H = 150;
const PLOT_TOP = 10;
const PLOT_BOTTOM = 130;
const PLOT_H = PLOT_BOTTOM - PLOT_TOP;
const PAD_X = 6;

/** Daily spend as bars, with the daily allowance drawn as a green reference
 *  line; days that exceed it turn red. All figures in centavos. */
export function DailySpendingChart({
  days,
  perDay,
  totalSpent,
  currency,
  periodLabel,
}: {
  days: DailyTotal[];
  perDay: number;
  totalSpent: number;
  currency: string;
  periodLabel: string;
}) {
  const max = Math.max(perDay, ...days.map((day) => day.amount), 1);
  const n = Math.max(days.length, 1);
  const slot = (VIEW_W - PAD_X * 2) / n;
  const barW = slot * 0.6;
  const refY = perDay > 0 ? PLOT_BOTTOM - (perDay / max) * PLOT_H : null;

  return (
    <div>
      <div className="cf-head">
        <span className="field-label">Daily spending</span>
        <span className="cf-head__value tabular-nums">{formatMoney(totalSpent, currency)}</span>
      </div>

      {days.length === 0 ? (
        <p className="text-faint py-8 text-center text-sm">No spending to chart yet.</p>
      ) : (
        <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} className="cf-svg" role="img" aria-label="Daily spending">
          {refY !== null ? (
            <line
              x1={PAD_X}
              x2={VIEW_W - PAD_X}
              y1={refY}
              y2={refY}
              stroke="var(--accent)"
              strokeWidth="1.5"
              strokeOpacity="0.85"
            />
          ) : null}
          {days.map((day, i) => {
            const h = (day.amount / max) * PLOT_H;
            const x = PAD_X + i * slot + (slot - barW) / 2;
            const y = PLOT_BOTTOM - h;
            const over = perDay > 0 && day.amount > perDay;
            return (
              <rect
                key={day.date}
                x={x}
                y={y}
                width={barW}
                height={Math.max(h, day.amount > 0 ? 2 : 0)}
                rx="2"
                fill={over ? 'var(--danger)' : 'var(--border-strong)'}
              />
            );
          })}
        </svg>
      )}

      <p className="text-faint mt-1 text-xs">
        {periodLabel}
        {perDay > 0 ? ` · line = ${formatMoney(perDay, currency)}/day` : ''}
      </p>
    </div>
  );
}
