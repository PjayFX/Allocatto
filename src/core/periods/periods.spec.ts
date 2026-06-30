import { describe, it, expect } from 'vitest';
import { adjustPayday } from './adjustPayday';
import { paydaysInMonth } from './paydaysInMonth';
import { payPeriodFor } from './payPeriodFor';
import { payPeriodFrom } from './payPeriodFrom';
import { allocateSalary } from '../allocateSalary';
import { personalConfig } from '../examples';

describe('adjustPayday — when pay actually lands', () => {
  it('moves a Friday back to the Thursday of that week', () => {
    expect(adjustPayday('2026-05-15')).toBe('2026-05-14'); // Fri -> Thu
  });

  it('moves a Saturday back to the Thursday of that week', () => {
    expect(adjustPayday('2026-05-16')).toBe('2026-05-14'); // Sat -> Thu
  });

  it('moves a Sunday forward to the following Monday', () => {
    expect(adjustPayday('2026-05-31')).toBe('2026-06-01'); // Sun -> Mon
  });

  it('leaves a Monday–Thursday payday untouched', () => {
    expect(adjustPayday('2026-05-13')).toBe('2026-05-13'); // Wednesday
  });
});

describe('paydaysInMonth — 15th and last day, shifted to real paydays', () => {
  it('shifts the 15th (Fri) earlier and the 31st (Sun) into the next month', () => {
    // May 2026: 15th is Friday -> Thu 14th; 31st is Sunday -> Mon Jun 1st.
    expect(paydaysInMonth(2026, 5)).toEqual(['2026-05-14', '2026-06-01']);
  });
});

describe('payPeriodFor — the period a date falls in', () => {
  it('runs from the mid-month payday to the month-end payday', () => {
    expect(payPeriodFor('2026-05-20')).toEqual({
      start: '2026-05-14',
      end: '2026-06-01',
      days: 18,
    });
  });

  it('runs from a month-end payday to the next mid-month payday', () => {
    expect(payPeriodFor('2026-06-05')).toEqual({
      start: '2026-06-01',
      end: '2026-06-15',
      days: 14,
    });
  });

  it('handles a date before the mid-month payday', () => {
    expect(payPeriodFor('2026-05-10')).toEqual({
      start: '2026-04-30',
      end: '2026-05-14',
      days: 14,
    });
  });
});

describe('payPeriodFrom — runway from the day you were paid', () => {
  it('starts on the logged date and ends on the next scheduled payday', () => {
    // Logged May 15; next scheduled payday is Jun 1 (May 31 Sun -> Mon).
    expect(payPeriodFrom('2026-05-15')).toEqual({
      start: '2026-05-15',
      end: '2026-06-01',
      days: 17,
    });
  });

  it('matches the schedule when logged exactly on a payday', () => {
    // May 14 is the shifted mid-month payday; runway equals the schedule span.
    expect(payPeriodFrom('2026-05-14')).toEqual({
      start: '2026-05-14',
      end: '2026-06-01',
      days: 18,
    });
  });
});

describe('allocateSalary — paidOn derives the period', () => {
  it('sets daysInPeriod and period from the logged date to the next payday', () => {
    const result = allocateSalary(15601.98, personalConfig, { paidOn: '2026-05-15' });
    expect(result.daysInPeriod).toBe(17);
    expect(result.period).toEqual({ start: '2026-05-15', end: '2026-06-01', days: 17 });
  });

  it('lets an explicit daysInPeriod win over the derived one', () => {
    const result = allocateSalary(15601.98, personalConfig, {
      paidOn: '2026-05-15',
      daysInPeriod: 30,
    });
    expect(result.daysInPeriod).toBe(30);
  });
});
