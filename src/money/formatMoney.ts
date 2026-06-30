import type { CurrencyCode } from '../types';
import { fromCentavos } from './fromCentavos';

/** Format centavos as a localized currency string, e.g. 660198 + "PHP" -> "₱6,601.98". */
export function formatMoney(centavos: number, currency: CurrencyCode, locale?: string): string {
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(
    fromCentavos(centavos),
  );
}
