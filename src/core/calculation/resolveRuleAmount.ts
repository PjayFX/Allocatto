import type { AllocationRule } from '../types';
import { toCentavos } from '../money';

/** Resolve a single rule to centavos, given the salary in centavos. */
export function resolveRuleAmount(rule: AllocationRule, salaryCentavos: number): number {
  if (rule.kind === 'amount') {
    return toCentavos(rule.amount);
  }
  return Math.round((salaryCentavos * rule.percent) / 100);
}
