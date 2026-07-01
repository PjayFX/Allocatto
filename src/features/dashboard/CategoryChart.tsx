import type { CategoryTotal } from '../../core';
import { formatMoney } from '../../core';

/** Horizontal bars per category, largest first — the "most spent on" view.
 *  The top category is accented; the rest stay monochrome. */
export function CategoryChart({
  totals,
  currency,
}: {
  totals: CategoryTotal[];
  currency: string;
}) {
  const ranked = [...totals].sort((a, b) => b.amount - a.amount);
  const max = Math.max(...ranked.map((total) => total.amount), 1);
  const grandTotal = ranked.reduce((sum, total) => sum + total.amount, 0);

  return (
    <div>
      <div className="cf-head">
        <span className="field-label">By category</span>
        <span className="cf-head__value tabular-nums">{formatMoney(grandTotal, currency)}</span>
      </div>

      {ranked.length === 0 ? (
        <p className="text-faint py-8 text-center text-sm">No categorized spending yet.</p>
      ) : (
        <div className="cat-chart">
          {ranked.slice(0, 6).map((total, i) => (
            <div key={total.category} className="cat-chart__row">
              <div className="cat-chart__meta">
                <span className="truncate">{total.category}</span>
                <span className="text-muted tabular-nums">{formatMoney(total.amount, currency)}</span>
              </div>
              <div className="cat-chart__track">
                <span
                  className="cat-chart__fill"
                  style={{
                    width: `${(total.amount / max) * 100}%`,
                    background: i === 0 ? 'var(--accent)' : 'var(--border-strong)',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
