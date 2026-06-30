import type { CSSProperties } from 'react';
import { formatMoney } from '../core';
import type { CurrencyCode } from '../core';

/** Render a centavos amount using the core's currency formatter. */
export function MoneyText({
  centavos,
  currency,
  className,
  style,
}: {
  centavos: number;
  currency: CurrencyCode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <span className={className} style={style}>
      {formatMoney(centavos, currency)}
    </span>
  );
}
