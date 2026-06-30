import type { Bucket, BucketAllocation } from '../types';
import { resolveRuleAmount } from './resolveRuleAmount';

/** Resolve every bucket to its centavo share for the given salary. */
export function allocateBuckets(buckets: Bucket[], salaryCentavos: number): BucketAllocation[] {
  return buckets.map((bucket) => ({
    bucket,
    amount: resolveRuleAmount(bucket.rule, salaryCentavos),
  }));
}
