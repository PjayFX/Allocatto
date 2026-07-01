import { useRef, useState } from 'react';
import { useBackupStore } from '../../store/backupStore';
import { exportBackup } from './exportBackup';
import { applyBackup, readBackupFile } from './restoreBackup';
import { buildCurrentBackup } from './currentBackup';
import {
  chooseBackupFile,
  clearBackupHandle,
  fileBackupSupported,
  writeBackupToFile,
} from './backupFile';

type Note = { tone: 'ok' | 'err'; text: string } | null;

/** Read a chosen file, validate it, and — after confirmation — replace all data. */
async function restoreFrom(file: File): Promise<Note> {
  const result = await readBackupFile(file);
  if (!result.ok) return { tone: 'err', text: result.error };
  if (!window.confirm('Restore will replace your current data with this backup. Continue?')) {
    return null;
  }
  applyBackup(result.backup);
  return { tone: 'ok', text: 'Backup restored.' };
}

/** Export/import controls plus the automatic-backup toggle. Shared by the About
 *  sheet and the Summary tab's settings. */
export function DataBackup() {
  const fileInput = useRef<HTMLInputElement>(null);
  const [note, setNote] = useState<Note>(null);
  const autoBackup = useBackupStore((s) => s.autoBackup);
  const backupFileName = useBackupStore((s) => s.backupFileName);
  const setAutoBackup = useBackupStore((s) => s.setAutoBackup);
  const markBackedUp = useBackupStore((s) => s.markBackedUp);

  async function toggleAuto(on: boolean): Promise<void> {
    if (!on) {
      setAutoBackup(false);
      await clearBackupHandle();
      return;
    }
    if (!fileBackupSupported()) {
      setNote({
        tone: 'err',
        text: 'Automatic backup needs Chrome or Edge (desktop, or Android 132+). Use Export on this device.',
      });
      return;
    }
    const handle = await chooseBackupFile();
    if (!handle) return; // picker cancelled — leave it off
    await writeBackupToFile(handle, buildCurrentBackup());
    setAutoBackup(true, handle.name);
    markBackedUp();
    setNote({ tone: 'ok', text: `Auto-backup on — writing to ${handle.name}.` });
  }

  return (
    <div className="about__data">
      <div className="about__data-actions">
        <button type="button" className="btn-add" onClick={exportBackup}>
          Export backup
        </button>
        <button type="button" className="btn-add" onClick={() => fileInput.current?.click()}>
          Import backup
        </button>
        <input
          ref={fileInput}
          type="file"
          accept=".allocatto,application/json,.json"
          className="hidden"
          onChange={async (event) => {
            const file = event.target.files?.[0];
            event.target.value = '';
            if (file) setNote(await restoreFrom(file));
          }}
        />
      </div>
      <label className="about__auto">
        <input
          type="checkbox"
          checked={autoBackup}
          onChange={(event) => void toggleAuto(event.target.checked)}
        />
        <span>
          <span className="about__auto-title">Automatic backup</span>
          <span className="about__auto-hint text-xs">
            {autoBackup && backupFileName
              ? `Overwrites ${backupFileName} once a day — no clutter, no reminders.`
              : 'Pick a file once; it gets overwritten daily. Desktop Chrome/Edge or Android Chrome.'}
          </span>
        </span>
      </label>
      {note ? (
        <p className={note.tone === 'err' ? 'text-danger text-xs' : 'text-success text-xs'}>
          {note.text}
        </p>
      ) : null}
    </div>
  );
}
