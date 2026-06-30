import type { ISODate } from '../types';
import { parseISO } from './parseISO';
import { toISO } from './toISO';

/** The ISO date `days` away from `iso` (negative counts backwards). */
export function addDays(iso: ISODate, days: number): string {
  const date = parseISO(iso);
  date.setUTCDate(date.getUTCDate() + days);
  return toISO(date);
}
