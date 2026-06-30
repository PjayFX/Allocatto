import type { ISODate } from '../types';
import { parseISO } from './parseISO';

/** Day of week for an ISO date: 0 = Sunday … 6 = Saturday. */
export function weekdayOf(iso: ISODate): number {
  return parseISO(iso).getUTCDay();
}
