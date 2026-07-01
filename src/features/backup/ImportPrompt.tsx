import { useRef, useState } from 'react';
import { usePlanStore } from '../../store/planStore';
import { useTrackerStore } from '../../store/trackerStore';
import { useBackupStore } from '../../store/backupStore';
import { applyBackup, readBackupFile } from './restoreBackup';

/** True when nothing has been entered yet — a fresh install or just-cleared data. */
function useIsEmpty(): boolean {
  const salary = usePlanStore((s) => s.salary);
  const payHistory = usePlanStore((s) => s.payHistory);
  const expenses = useTrackerStore((s) => s.expenses);
  const savings = useTrackerStore((s) => s.savings);
  return salary === 0 && payHistory.length === 0 && expenses.length === 0 && savings.length === 0;
}

/** Offers a one-tap restore when the app opens with no data. Browsers can't scan
 *  the device, so the user still picks the file — this just surfaces the option
 *  exactly when it's useful (fresh start or after clearing browser data). */
export function ImportPrompt() {
  const lastBackupAt = useBackupStore((s) => s.lastBackupAt);
  const importDismissed = useBackupStore((s) => s.importDismissed);
  const dismissImport = useBackupStore((s) => s.dismissImport);
  const isEmpty = useIsEmpty();
  const fileInput = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const fresh = isEmpty && lastBackupAt === null && !importDismissed;
  if (!fresh) return null;

  return (
    <div className="import-prompt" role="status">
      <span className="import-prompt__text">
        Starting fresh? If you have a backup file, import it to pick up where you left off.
        {error ? <span className="import-prompt__error text-xs"> {error}</span> : null}
      </span>
      <span className="import-prompt__actions">
        <button type="button" className="ghost-btn text-xs" onClick={dismissImport}>
          Not now
        </button>
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={() => fileInput.current?.click()}
        >
          Import backup
        </button>
      </span>
      <input
        ref={fileInput}
        type="file"
        accept=".allocatto,application/json,.json"
        className="hidden"
        onChange={async (event) => {
          const file = event.target.files?.[0];
          event.target.value = '';
          if (!file) return;
          const result = await readBackupFile(file);
          if (result.ok) applyBackup(result.backup);
          else setError(result.error);
        }}
      />
    </div>
  );
}
