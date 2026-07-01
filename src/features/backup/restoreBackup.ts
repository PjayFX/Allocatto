import type { Backup } from '../../core';
import { parseBackup } from '../../core';
import { usePlanStore } from '../../store/planStore';
import { useTrackerStore } from '../../store/trackerStore';
import { useBackupStore } from '../../store/backupStore';

export type ReadResult = { ok: true; backup: Backup } | { ok: false; error: string };

/** Parse and validate a chosen file without touching any state yet, so callers
 *  can confirm before overwriting. */
export async function readBackupFile(file: File): Promise<ReadResult> {
  const text = await file.text();
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return { ok: false, error: "That file isn't valid JSON." };
  }
  const result = parseBackup(parsed);
  if (!result.ok) return { ok: false, error: result.error };
  return { ok: true, backup: result.backup };
}

/** Replace all local data with a validated backup and mark it as freshly saved. */
export function applyBackup(backup: Backup): void {
  usePlanStore.setState(backup.plan);
  // Default the icon map so older (iconless) backups don't leave it undefined.
  useTrackerStore.setState({
    ...backup.tracker,
    categoryIcons: backup.tracker.categoryIcons ?? {},
  });
  useBackupStore.getState().markBackedUp();
}
