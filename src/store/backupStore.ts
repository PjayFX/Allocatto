import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/** Device-local backup bookkeeping. Deliberately separate from the plan/tracker
 *  stores so it never rides along in an exported backup (which would make a
 *  restored file lie about when it was last backed up). */
interface BackupState {
  /** Epoch ms of the last export/restore, or null if never. */
  lastBackupAt: number | null;
  /** Epoch ms until which the reminder is snoozed, or null. */
  snoozeUntil: number | null;
  /** When on, the linked backup file is overwritten automatically each day. */
  autoBackup: boolean;
  /** Name of the file auto-backup writes to, for display (the handle itself
   *  lives in IndexedDB). Null when no file is linked. */
  backupFileName: string | null;
  /** Set once the user dismisses the "import your backup" prompt on a fresh /
   *  just-cleared install, so it doesn't keep nagging. Wiped with site data. */
  importDismissed: boolean;
  markBackedUp: () => void;
  snooze: (days: number) => void;
  setAutoBackup: (on: boolean, fileName?: string | null) => void;
  dismissImport: () => void;
}

const DAY_MS = 24 * 60 * 60 * 1000;

export const useBackupStore = create<BackupState>()(
  persist(
    (set) => ({
      lastBackupAt: null,
      snoozeUntil: null,
      autoBackup: false,
      backupFileName: null,
      importDismissed: false,
      markBackedUp: () => set({ lastBackupAt: Date.now(), snoozeUntil: null }),
      snooze: (days) => set({ snoozeUntil: Date.now() + days * DAY_MS }),
      setAutoBackup: (on, fileName = null) =>
        set({ autoBackup: on, backupFileName: on ? fileName : null }),
      dismissImport: () => set({ importDismissed: true }),
    }),
    { name: 'allocatto-backup-meta' },
  ),
);
