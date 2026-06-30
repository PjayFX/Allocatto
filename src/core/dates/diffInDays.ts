import type { ISODate } from '../types';
import { parseISO } from './parseISO';

const MS_PER_DAY = 86_400_000;

/** Whole days from `from` up to `to` (positive when `to` is later). */
export function diffInDays(from: ISODate, to: ISODate): number {
  return Math.round((parseISO(to).getTime() - parseISO(from).getTime()) / MS_PER_DAY);
}
