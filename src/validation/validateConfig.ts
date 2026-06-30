import type { AllocationConfig, ValidationIssue } from '../types';
import { resolveRuleAmount } from '../calculation';

/**
 * Validate a config against a salary (in centavos). Never throws - returns a list
 * of issues. Error-severity issues make the result invalid, but the caller can
 * still inspect the numbers (e.g. to surface a negative allowance / overspend).
 */
export function validateConfig(
  config: AllocationConfig,
  salaryCentavos: number,
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  const seen = new Set<string>();
  for (const bucket of config.buckets) {
    if (seen.has(bucket.id)) {
      issues.push({
        severity: 'error',
        code: 'duplicate_bucket',
        message: `Duplicate bucket id "${bucket.id}".`,
        bucketId: bucket.id,
      });
    }
    seen.add(bucket.id);

    const value = bucket.rule.kind === 'amount' ? bucket.rule.amount : bucket.rule.percent;
    if (value < 0) {
      issues.push({
        severity: 'error',
        code: 'negative_value',
        message: `Bucket "${bucket.name}" has a negative value.`,
        bucketId: bucket.id,
      });
    }
  }

  const totalPercent = config.buckets.reduce(
    (sum, b) => (b.rule.kind === 'percentage' ? sum + b.rule.percent : sum),
    0,
  );
  if (totalPercent > 100) {
    issues.push({
      severity: 'error',
      code: 'percent_over_100',
      message: `Percentage buckets total ${totalPercent}%, which exceeds 100%.`,
    });
  }

  const totalCommitted = config.buckets.reduce(
    (sum, b) => sum + resolveRuleAmount(b.rule, salaryCentavos),
    0,
  );
  if (totalCommitted > salaryCentavos) {
    issues.push({
      severity: 'error',
      code: 'committed_over_salary',
      message: 'Committed buckets exceed the salary.',
    });
  }

  return issues;
}
