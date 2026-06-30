import type { ISODate } from '../types';

/** Parse a "YYYY-MM-DD" string into a UTC Date so day math never drifts by time zone. */
export function parseISO(iso: ISODate): Date {
  const parts = iso.split('-');
  const year = Number(parts[0]);
  const month = Number(parts[1]);
  const day = Number(parts[2]);
  return new Date(Date.UTC(year, month - 1, day));
}
