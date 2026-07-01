import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AllocationConfig, AllocationRule, Bucket, Paycheck } from '../core';
import { todayISO } from '../core';

const defaultConfig: AllocationConfig = {
  currency: 'PHP',
  buckets: [
    { id: 'savings', name: 'Savings', rule: { kind: 'amount', amount: 5000 } },
    { id: 'bills', name: 'Bills', rule: { kind: 'amount', amount: 3500 } },
    { id: 'wants', name: 'Wants', rule: { kind: 'percentage', percent: 10 } },
  ],
};

interface PlanState {
  salary: number;
  paidOn: string;
  config: AllocationConfig;
  /** Destination QR for the leftover allowance (it is payable too, not a bucket). */
  allowanceQrPh?: string;
  /** Completed pays, recorded when a new pay is started. The active salary is
   *  the latest pay and isn't in here until superseded. */
  payHistory: Paycheck[];
  setSalary: (salary: number) => void;
  logNewSalary: () => void;
  /** Fix the current pay's amount in place, keeping its pay date (unlike
   *  setSalary, which stamps today). Setting 0 clears the current pay. */
  correctSalary: (amount: number) => void;
  /** Delete an archived pay from history — e.g. one logged by mistake. */
  removePaycheck: (id: string) => void;
  renameBucket: (id: string, name: string) => void;
  setBucketRule: (id: string, rule: AllocationRule) => void;
  setBucketQrPh: (id: string, qrPh: string | null) => void;
  setAllowanceQrPh: (qrPh: string | null) => void;
  addBucket: () => void;
  removeBucket: (id: string) => void;
}

function patchBucket(buckets: Bucket[], id: string, patch: (bucket: Bucket) => Bucket): Bucket[] {
  return buckets.map((bucket) => (bucket.id === id ? patch(bucket) : bucket));
}

/** Strip any stored QR Ph payloads (e.g. previously seeded test accounts) so no
 *  personal account data lingers in persisted state. */
function clearStoredQrs(state: PlanState): PlanState {
  return {
    ...state,
    allowanceQrPh: undefined,
    payHistory: state.payHistory ?? [],
    config: {
      ...state.config,
      buckets: state.config.buckets.map(({ qrPh: _qrPh, ...bucket }) => bucket),
    },
  };
}

export const usePlanStore = create<PlanState>()(
  persist(
    (set) => ({
      salary: 0,
      paidOn: todayISO(),
      config: defaultConfig,
      allowanceQrPh: undefined,
      payHistory: [],
      // Entering the salary auto-logs today as the pay date (period derives from it).
      setSalary: (salary) => set({ salary, paidOn: todayISO() }),
      // Start a fresh pay: archive the current pay into history (if any), then
      // stamp today and clear the amount for entry.
      logNewSalary: () =>
        set((state) => ({
          payHistory:
            state.salary > 0
              ? [
                  ...state.payHistory,
                  {
                    id: crypto.randomUUID(),
                    amount: state.salary,
                    date: state.paidOn,
                    config: state.config,
                  },
                ]
              : state.payHistory,
          salary: 0,
          paidOn: todayISO(),
        })),
      correctSalary: (amount) => set({ salary: amount }),
      removePaycheck: (id) =>
        set((state) => ({ payHistory: state.payHistory.filter((pay) => pay.id !== id) })),
      renameBucket: (id, name) =>
        set((state) => ({
          config: {
            ...state.config,
            buckets: patchBucket(state.config.buckets, id, (bucket) => ({ ...bucket, name })),
          },
        })),
      setBucketRule: (id, rule) =>
        set((state) => ({
          config: {
            ...state.config,
            buckets: patchBucket(state.config.buckets, id, (bucket) => ({ ...bucket, rule })),
          },
        })),
      setBucketQrPh: (id, qrPh) =>
        set((state) => ({
          config: {
            ...state.config,
            buckets: patchBucket(state.config.buckets, id, (bucket) => ({
              ...bucket,
              qrPh: qrPh ?? undefined,
            })),
          },
        })),
      setAllowanceQrPh: (qrPh) => set({ allowanceQrPh: qrPh ?? undefined }),
      addBucket: () =>
        set((state) => ({
          config: {
            ...state.config,
            buckets: [
              ...state.config.buckets,
              { id: crypto.randomUUID(), name: 'New category', rule: { kind: 'amount', amount: 0 } },
            ],
          },
        })),
      removeBucket: (id) =>
        set((state) => ({
          config: {
            ...state.config,
            buckets: state.config.buckets.filter((bucket) => bucket.id !== id),
          },
        })),
    }),
    {
      name: 'allocato-plan',
      version: 7, // v7: snapshot bucket config onto archived paychecks
      migrate: (persisted) => clearStoredQrs(persisted as PlanState),
    },
  ),
);
