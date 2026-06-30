import type { ISODate, PayPeriod } from '../types';
import { parseISO, diffInDays } from '../dates';
import { paydaysInMonth } from './paydaysInMonth';

/** Shift a 1-indexed (year, month) by whole months, rolling the year over. */
function shiftMonth(year: number, month: number, by: number): [number, number] {
  const zeroBased = month - 1 + by;
  return [year + Math.floor(zeroBased / 12), ((zeroBased % 12) + 12) % 12 + 1];
}

/**
 * The pay period that contains `iso`: it starts on the payday on or before that
 * date and ends on the next payday. `days` is the span used for the per-day rate.
 */
export function payPeriodFor(iso: ISODate): PayPeriod {
  const date = parseISO(iso);
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;

  const candidates = [
    ...paydaysInMonth(...shiftMonth(year, month, -1)),
    ...paydaysInMonth(year, month),
    ...paydaysInMonth(...shiftMonth(year, month, +1)),
  ].sort();

  const start = candidates.filter((payday) => payday <= iso).at(-1)!;
  const end = candidates.find((payday) => payday > start)!;
  return { start, end, days: diffInDays(start, end) };
}
