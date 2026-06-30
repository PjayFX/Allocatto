import { parseEmv } from './parseEmv';

export interface PaymentItem {
  label: string;
  amountCentavos: number;
  qrPh: string;
}

export interface PaymentGroup {
  qrPh: string;
  amountCentavos: number;
  /** Categories that pay into this destination (in first-seen order). */
  labels: string[];
  recipientName?: string;
}

/** The recipient/merchant name embedded in a QR Ph payload (tag 59), if present. */
export function recipientName(qrPh: string): string | undefined {
  return parseEmv(qrPh).find((field) => field.tag === '59')?.value;
}

/**
 * Group payment items by their QR payload — i.e. by destination account. Items
 * sharing the exact same QR are merged into one group whose amount is the sum of
 * theirs, so a single combined transfer covers them. Order follows first sight.
 */
export function groupPayments(items: PaymentItem[]): PaymentGroup[] {
  const groups = new Map<string, PaymentGroup>();
  for (const item of items) {
    const existing = groups.get(item.qrPh);
    if (existing) {
      existing.amountCentavos += item.amountCentavos;
      existing.labels.push(item.label);
    } else {
      groups.set(item.qrPh, {
        qrPh: item.qrPh,
        amountCentavos: item.amountCentavos,
        labels: [item.label],
        recipientName: recipientName(item.qrPh),
      });
    }
  }
  return [...groups.values()];
}
