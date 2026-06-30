import type { ISODate } from '../types';
import { weekdayOf, addDays } from '../dates';

/**
 * Move a scheduled payday (the 15th or month-end) to the day pay actually lands,
 * following the owner's payroll pattern:
 *  - Friday    -> the Thursday of that week (-1)
 *  - Saturday  -> the Thursday of that week (-2)
 *  - Sunday    -> the following Monday (+1)
 *  - Mon–Thu   -> unchanged
 */
export function adjustPayday(iso: ISODate): string {
  const day = weekdayOf(iso);
  if (day === 5) return addDays(iso, -1); // Friday -> Thursday
  if (day === 6) return addDays(iso, -2); // Saturday -> Thursday
  if (day === 0) return addDays(iso, 1); // Sunday -> Monday
  return iso;
}
