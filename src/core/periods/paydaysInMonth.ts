import { toISO, lastDayOfMonth } from '../dates';
import { adjustPayday } from './adjustPayday';

/**
 * The two paydays for a 1-indexed month — the 15th and the last calendar day —
 * each moved to the day pay actually lands, returned ascending as "YYYY-MM-DD".
 */
export function paydaysInMonth(year: number, month: number): string[] {
  const mid = toISO(new Date(Date.UTC(year, month - 1, 15)));
  const end = toISO(new Date(Date.UTC(year, month - 1, lastDayOfMonth(year, month))));
  return [adjustPayday(mid), adjustPayday(end)];
}
