// types — core data shapes for salary allocation

/** ISO 4217 currency code, e.g. "PHP", "USD". */
export type CurrencyCode = string;

/** How a bucket takes its share: a fixed amount, or a percentage of salary. */
export type AllocationRule =
  | { kind: 'amount'; amount: number } // major units, e.g. 5000 means ₱5,000.00
  | { kind: 'percentage'; percent: number }; // 0–100, percent of salary

/** A named destination for part of the salary (e.g. Savings, Bills, Wants). */
export interface Bucket {
  id: string;
  name: string;
  rule: AllocationRule;
}

export interface AllocationConfig {
  currency: CurrencyCode;
  buckets: Bucket[];
}

export interface AllocateOptions {
  /** Days in the pay period used for the per-day rate. Defaults to 15. */
  daysInPeriod?: number;
}

export type IssueSeverity = 'error' | 'warning';

export interface ValidationIssue {
  severity: IssueSeverity;
  code: string;
  message: string;
  bucketId?: string;
}

/** One bucket's resolved share, in centavos (minor units). */
export interface BucketAllocation {
  bucket: Bucket;
  amount: number;
}

export interface AllocationResult {
  currency: CurrencyCode;
  /** Salary in centavos. */
  salary: number;
  allocations: BucketAllocation[];
  /** Sum of all bucket shares, in centavos. */
  totalCommitted: number;
  /** Spendable pool = salary − totalCommitted, in centavos. May be negative when overspent. */
  allowance: number;
  /** Allowance spread per day of the period, in centavos. */
  perDay: number;
  daysInPeriod: number;
  /** False when any error-severity issue is present. */
  valid: boolean;
  issues: ValidationIssue[];
}
