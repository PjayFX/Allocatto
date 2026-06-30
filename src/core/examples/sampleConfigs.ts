import type { AllocationConfig } from '../types';

/** The owner's real Notion setup: fixed Savings, Bills, Wants in PHP. */
export const personalConfig: AllocationConfig = {
  currency: 'PHP',
  buckets: [
    { id: 'savings', name: 'Savings', rule: { kind: 'amount', amount: 5000 } },
    { id: 'bills', name: 'Bills', rule: { kind: 'amount', amount: 3500 } },
    { id: 'wants', name: 'Wants', rule: { kind: 'amount', amount: 500 } },
  ],
};

/** A percentage-based example, to show that rule type working. */
export const percentageConfig: AllocationConfig = {
  currency: 'PHP',
  buckets: [
    { id: 'savings', name: 'Savings', rule: { kind: 'percentage', percent: 20 } },
    { id: 'rent', name: 'Rent', rule: { kind: 'percentage', percent: 30 } },
    { id: 'food', name: 'Food', rule: { kind: 'amount', amount: 4000 } },
  ],
};
