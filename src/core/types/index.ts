// types — core data shapes for salary allocation

/** ISO 4217 currency code, e.g. "PHP", "USD". */
export type CurrencyCode = string;

/** A calendar date as a "YYYY-MM-DD" string. */
export type ISODate = string;

/** A pay period bounded by two paydays. `days` is the span used for per-day math. */
export interface PayPeriod {
  start: ISODate;
  end: ISODate;
  days: number;
}

/** How a bucket takes its share: a fixed amount, or a percentage of salary. */
export type AllocationRule =
  | { kind: 'amount'; amount: number } // major units, e.g. 5000 means ₱5,000.00
  | { kind: 'percentage'; percent: number }; // 0–100, percent of salary

/** A named destination for part of the salary (e.g. Savings, Bills, Wants). */
export interface Bucket {
  id: string;
  name: string;
  rule: AllocationRule;
  /** Optional base static QR Ph payload (the bank/e-wallet's own QR string) used
   *  to generate a dynamic, amount-filled QR for this bucket's share. */
  qrPh?: string;
}

export interface AllocationConfig {
  currency: CurrencyCode;
  buckets: Bucket[];
}

export interface AllocateOptions {
  /** Days in the pay period used for the per-day rate. Defaults to 15. */
  daysInPeriod?: number;
  /** Pay date ("YYYY-MM-DD"); when given, daysInPeriod is derived from the pay schedule. */
  paidOn?: ISODate;
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
  /** The pay period this allocation covers, when derived from a pay date. */
  period?: PayPeriod;
  /** Centavos carried in from a previous period (negative = overspend deficit). Set by applyCarryover. */
  carriedOver?: number;
  /** False when any error-severity issue is present. */
  valid: boolean;
  issues: ValidationIssue[];
}

// --- Tracker (Phase 2) ---

export type ExpenseSource = 'manual' | 'receipt';

/** A single logged expense. `amount` is in major units (e.g. 75 = ₱75.00). */
export interface Expense {
  id: string;
  amount: number;
  /** ISO date, "YYYY-MM-DD". */
  date: string;
  /** Reporting label; categories are user-configurable. Missing = uncategorized. */
  category?: string;
  note?: string;
  source: ExpenseSource;
}

/** Spend total for one category, in centavos. */
export interface CategoryTotal {
  category: string;
  amount: number;
}

export interface SummarizeOptions {
  /** "Today" as an ISO date for spent-today / remaining-today. Defaults to the local date. */
  asOf?: string;
}

/** What was actually spent against an allocation's allowance. All money in centavos. */
export interface SpendingSummary {
  currency: CurrencyCode;
  asOf: string;
  allowance: number;
  perDay: number;
  totalSpent: number;
  /** allowance − totalSpent; negative when overspent. */
  remaining: number;
  /** Whole-number percent of the allowance used. */
  percentUsed: number;
  spentToday: number;
  /** perDay − spentToday; negative when today's spend exceeds the daily rate. */
  remainingToday: number;
  byCategory: CategoryTotal[];
  overspent: boolean;
}

export type SavingsKind = 'deposit' | 'withdrawal';

/** A movement into or out of savings. `amount` is in major units. */
export interface SavingsTransaction {
  id: string;
  amount: number;
  date: string;
  kind: SavingsKind;
  note?: string;
}

/** Running savings position. All money in centavos. */
export interface SavingsSummary {
  balance: number;
  totalDeposits: number;
  totalWithdrawals: number;
}
