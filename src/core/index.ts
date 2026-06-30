// Allocato core — public API
export { allocateSalary } from './allocateSalary';
export { summarizeSpending } from './spending';
export { summarizeSavings, savingsBalance } from './savings';
export { carryoverFor, applyCarryover } from './carryover';
export { payPeriodFor, payPeriodFrom, paydaysInMonth, adjustPayday } from './periods';
export * from './types';
export { formatMoney, toCentavos, fromCentavos } from './money';
export { todayISO } from './dates';
export { parseEmv, computeCrc16, injectAmount, validateQrPh, groupPayments, recipientName } from './qrph';
export type { EmvField, InjectOptions, PaymentItem, PaymentGroup } from './qrph';
