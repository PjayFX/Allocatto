import type { SavingsPoint } from '../../core';
import { formatMoney } from '../../core';

const VIEW_W = 320;
const VIEW_H = 150;
const PLOT_TOP = 12;
const PLOT_BOTTOM = 130;
const PLOT_H = PLOT_BOTTOM - PLOT_TOP;
const PAD_X = 6;

/** Cumulative savings balance over time as an area line. Balances in centavos. */
export function SavingsChart({
  points,
  currency,
}: {
  points: SavingsPoint[];
  currency: string;
}) {
  const balances = points.map((point) => point.balance);
  const current = balances.at(-1) ?? 0;
  const minBalance = Math.min(0, ...balances);
  const maxBalance = Math.max(1, ...balances);
  const range = maxBalance - minBalance || 1;
  const n = points.length;
  const stepX = n > 1 ? (VIEW_W - PAD_X * 2) / (n - 1) : 0;

  const coords = points.map((point, i) => ({
    x: n > 1 ? PAD_X + i * stepX : VIEW_W / 2,
    y: PLOT_BOTTOM - ((point.balance - minBalance) / range) * PLOT_H,
  }));
  const line = coords.map((c) => `${c.x},${c.y}`).join(' ');
  const first = coords[0];
  const last = coords[coords.length - 1];
  const area =
    first && last
      ? `M ${first.x} ${PLOT_BOTTOM} ` +
        coords.map((c) => `L ${c.x} ${c.y}`).join(' ') +
        ` L ${last.x} ${PLOT_BOTTOM} Z`
      : '';

  return (
    <div>
      <div className="cf-head">
        <span className="field-label">Savings</span>
        <span className="cf-head__value tabular-nums text-success">
          {formatMoney(current, currency)}
        </span>
      </div>

      {n === 0 ? (
        <p className="text-faint py-8 text-center text-sm">No savings activity yet.</p>
      ) : (
        <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} className="cf-svg" role="img" aria-label="Savings balance">
          <defs>
            <linearGradient id="savingsFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.28" />
              <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
            </linearGradient>
          </defs>
          {area ? <path d={area} fill="url(#savingsFill)" /> : null}
          {n > 1 ? (
            <polyline
              points={line}
              fill="none"
              stroke="var(--accent)"
              strokeWidth="2"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          ) : null}
          {coords.map((c, i) => (
            <circle key={i} cx={c.x} cy={c.y} r={n > 1 ? 2.5 : 4} fill="var(--accent)" />
          ))}
        </svg>
      )}
    </div>
  );
}
