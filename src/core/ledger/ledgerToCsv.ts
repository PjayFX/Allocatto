import type { LedgerEntry } from '../types';

const HEADERS = ['Date', 'Type', 'Description', 'Category', 'Amount'];

/** Quote a cell only when it contains a comma, quote, or newline (RFC 4180). */
function escapeCell(value: string): string {
  return /[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}

/** Signed major-unit amount, e.g. -75.00 for spending, 21000.00 for pay. */
function signedAmount(entry: LedgerEntry): string {
  const centavos = entry.direction === 'in' ? entry.amount : -entry.amount;
  return (centavos / 100).toFixed(2);
}

/** Render the records as CSV text (headers + one row per entry). */
export function ledgerToCsv(entries: LedgerEntry[]): string {
  const rows = entries.map((entry) =>
    [entry.date, entry.kind, entry.label, entry.sublabel ?? '', signedAmount(entry)]
      .map(escapeCell)
      .join(','),
  );
  return [HEADERS.join(','), ...rows].join('\n');
}
