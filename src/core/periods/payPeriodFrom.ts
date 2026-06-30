import type { ISODate, PayPeriod } from '../types';
import { diffInDays } from '../dates';
import { payPeriodFor } from './payPeriodFor';

/**
 * The spending runway from the day you were actually paid (`iso`) to the next
 * scheduled payday. Unlike `payPeriodFor`, the start is the logged date itself,
 * so `days` reflects how long the allowance must stretch from today.
 */
export function payPeriodFrom(iso: ISODate): PayPeriod {
  const end = payPeriodFor(iso).end;
  return { start: iso, end, days: diffInDays(iso, end) };
}
