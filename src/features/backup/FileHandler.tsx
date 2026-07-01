import { useEffect } from 'react';
import { usePlanStore } from '../../store/planStore';
import { useTrackerStore } from '../../store/trackerStore';
import { applyBackup, readBackupFile } from './restoreBackup';

interface LaunchParams {
  files?: FileSystemFileHandle[];
}
interface LaunchQueue {
  setConsumer: (consumer: (params: LaunchParams) => void) => void;
}
declare global {
  interface Window {
    launchQueue?: LaunchQueue;
  }
}

/** Nothing entered yet — safe to import without a "replace your data?" warning. */
function isDataEmpty(): boolean {
  const plan = usePlanStore.getState();
  const tracker = useTrackerStore.getState();
  return (
    plan.salary === 0 &&
    plan.payHistory.length === 0 &&
    tracker.expenses.length === 0 &&
    tracker.savings.length === 0
  );
}

async function importLaunchedFile(handle: FileSystemFileHandle): Promise<void> {
  const result = await readBackupFile(await handle.getFile());
  if (!result.ok) {
    window.alert(`Couldn't open that backup: ${result.error}`);
    return;
  }
  if (isDataEmpty() || window.confirm('Import this backup? It will replace your current data.')) {
    applyBackup(result.backup);
  }
}

/** When the installed app is launched by opening a .allocatto file, the OS hands
 *  us the file here — so a fresh device restores in one step, no in-app picker.
 *  Only fires for installed PWAs on platforms that support file handling. */
export function FileHandler() {
  useEffect(() => {
    const queue = window.launchQueue;
    if (!queue) return;
    queue.setConsumer((params) => {
      const handle = params.files?.[0];
      if (handle) void importLaunchedFile(handle);
    });
  }, []);

  return null;
}
