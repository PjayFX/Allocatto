import { useEffect } from 'react';
import { usePlanStore } from '../../store/planStore';
import { useTrackerStore } from '../../store/trackerStore';
import { useBackupStore } from '../../store/backupStore';
import { buildCurrentBackup } from './currentBackup';
import { hasWritePermission, loadBackupHandle, writeBackupToFile } from './backupFile';

const STALE_DAYS = 1;
const DAY_MS = 24 * 60 * 60 * 1000;

/** True once there's something worth protecting, so a fresh install stays quiet. */
function useHasData(): boolean {
  const salary = usePlanStore((s) => s.salary);
  const payHistory = usePlanStore((s) => s.payHistory);
  const expenses = useTrackerStore((s) => s.expenses);
  const savings = useTrackerStore((s) => s.savings);
  return salary > 0 || payHistory.length > 0 || expenses.length > 0 || savings.length > 0;
}

/** Overwrite the linked backup file once a day, silently. Rewriting the same
 *  file means no clutter. Only writes if permission is still granted (no prompt
 *  without a gesture); if it lapsed, re-linking in settings restores it. */
async function overwriteDailyBackup(): Promise<void> {
  const handle = await loadBackupHandle();
  if (!handle) return;
  if (!(await hasWritePermission(handle))) return;
  await writeBackupToFile(handle, buildCurrentBackup());
  useBackupStore.getState().markBackedUp();
}

/** Silent background runner: renders nothing, controls live in Summary settings. */
export function AutoBackup() {
  const autoBackup = useBackupStore((s) => s.autoBackup);
  const lastBackupAt = useBackupStore((s) => s.lastBackupAt);
  const hasData = useHasData();

  const stale = lastBackupAt === null || Date.now() - lastBackupAt > STALE_DAYS * DAY_MS;

  useEffect(() => {
    if (autoBackup && hasData && stale) void overwriteDailyBackup();
  }, [autoBackup, hasData, stale]);

  return null;
}
