import { todayISO } from '../../core';
import { useBackupStore } from '../../store/backupStore';
import { buildCurrentBackup } from './currentBackup';

/** Download a full snapshot as a fresh file, then stamp "backed up". Used for
 *  manual, one-off exports (auto-backup overwrites a single file instead). */
export function exportBackup(): void {
  const backup = buildCurrentBackup();
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `allocatto-backup-${todayISO()}.allocatto`;
  link.click();
  URL.revokeObjectURL(url);

  useBackupStore.getState().markBackedUp();
}
