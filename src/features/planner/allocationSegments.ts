import type { AllocationResult } from '../../core';
import { bucketColor, ALLOWANCE_COLOR } from './bucketColors';

/** One slice of the allocation bar: a bucket's share or the leftover allowance. */
export interface Segment {
  key: string;
  label: string;
  amount: number;
  color: string;
  width: number;
  isAllowance: boolean;
}

/** Break an allocation into bar segments (buckets + any positive allowance),
 *  each sized as a percentage of the salary/committed total. */
export function buildSegments(result: AllocationResult): Segment[] {
  const denom = Math.max(result.salary, result.totalCommitted, 1);
  const buckets = result.allocations.map((allocation, index) => ({
    key: allocation.bucket.id,
    label: allocation.bucket.name,
    amount: allocation.amount,
    color: bucketColor(index),
    width: (allocation.amount / denom) * 100,
    isAllowance: false,
  }));
  if (result.allowance <= 0) return buckets;
  return [
    ...buckets,
    {
      key: '__allowance',
      label: 'Allowance',
      amount: result.allowance,
      color: ALLOWANCE_COLOR,
      width: (result.allowance / denom) * 100,
      isAllowance: true,
    },
  ];
}

export function percentOfSalary(amount: number, salary: number): number {
  return salary > 0 ? Math.round((amount / salary) * 100) : 0;
}
