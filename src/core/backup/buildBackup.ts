import type { Backup, PlanSnapshot, TrackerSnapshot } from '../types';
import { todayISO } from '../dates';

/** Current backup schema version; bump when the snapshot shape changes so
 *  restore can migrate older files if needed. v2 added category icons. */
export const BACKUP_VERSION = 2;

/** Assemble a portable snapshot from the current plan + tracker data. */
export function buildBackup(plan: PlanSnapshot, tracker: TrackerSnapshot): Backup {
  return {
    app: 'allocatto',
    version: BACKUP_VERSION,
    exportedAt: todayISO(),
    plan,
    tracker,
  };
}
