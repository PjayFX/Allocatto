// Allocato core — public API
export { allocateSalary } from './allocateSalary';
export { summarizeSpending, expensesInPeriod, dailyTotals, expensesByDay, totalsByCategory, sumExpenses } from './spending';
export type { ExpenseDay } from './spending';
export { mergedCategories } from './categories';
export { rankSavedItemsByUsage } from './savedItems';
export { summarizeSavings, savingsBalance, savingsTimeline } from './savings';
export { salaryInsights } from './pay';
export { ledgerEntries, ledgerToCsv } from './ledger';
export { buildBackup, parseBackup, BACKUP_VERSION } from './backup';
export type { ParseResult } from './backup';
export { carryoverFor, applyCarryover } from './carryover';
export { payPeriodFor, payPeriodFrom, paydaysInMonth, adjustPayday } from './periods';
export * from './types';
export { formatMoney, toCentavos, fromCentavos } from './money';
export { todayISO, addDays } from './dates';
export { parseEmv, computeCrc16, injectAmount, validateQrPh, groupPayments, recipientName } from './qrph';
export type { EmvField, InjectOptions, PaymentItem, PaymentGroup } from './qrph';
