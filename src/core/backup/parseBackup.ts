import type { Backup } from '../types';

/** Outcome of validating an untrusted backup file. */
export type ParseResult =
  | { ok: true; backup: Backup }
  | { ok: false; error: string };

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function hasArrays(value: Record<string, unknown>, keys: string[]): boolean {
  return keys.every((key) => Array.isArray(value[key]));
}

/** Validate an already-JSON-parsed value as an Allocatto backup. Kept strict
 *  enough to reject foreign files, lenient enough to accept our own exports. */
export function parseBackup(raw: unknown): ParseResult {
  if (!isObject(raw)) return { ok: false, error: 'File is not a valid backup.' };
  if (raw.app !== 'allocatto') return { ok: false, error: 'This is not an Allocatto backup.' };

  const { plan, tracker } = raw;
  if (!isObject(plan) || !isObject(tracker)) {
    return { ok: false, error: 'Backup is missing its data.' };
  }
  if (!isObject(plan.config) || !Array.isArray(plan.payHistory)) {
    return { ok: false, error: 'Backup plan data is malformed.' };
  }
  if (!hasArrays(tracker, ['expenses', 'savedItems', 'categories', 'savings'])) {
    return { ok: false, error: 'Backup tracker data is malformed.' };
  }

  return { ok: true, backup: raw as unknown as Backup };
}
