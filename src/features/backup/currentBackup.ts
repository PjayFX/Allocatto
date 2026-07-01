import type { Backup } from '../../core';
import { buildBackup } from '../../core';
import { usePlanStore } from '../../store/planStore';
import { useTrackerStore } from '../../store/trackerStore';

/** Snapshot of everything the user owns, right now — the single source used by
 *  manual export, the auto-backup writer, and the file-handle overwrite. */
export function buildCurrentBackup(): Backup {
  const plan = usePlanStore.getState();
  const tracker = useTrackerStore.getState();
  return buildBackup(
    {
      salary: plan.salary,
      paidOn: plan.paidOn,
      config: plan.config,
      allowanceQrPh: plan.allowanceQrPh,
      payHistory: plan.payHistory,
    },
    {
      expenses: tracker.expenses,
      savedItems: tracker.savedItems,
      categories: tracker.categories,
      categoryIcons: tracker.categoryIcons,
      savings: tracker.savings,
    },
  );
}
