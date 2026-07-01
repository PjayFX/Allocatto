import { useMemo } from 'react';
import {
  allocateSalary,
  expensesByDay,
  expensesInPeriod,
  summarizeSpending,
  todayISO,
} from '../../core';
import { usePlanStore } from '../../store/planStore';
import { useTrackerStore } from '../../store/trackerStore';
import { SpendingSummaryCard } from './SpendingSummaryCard';
import { RecentExpenses } from './RecentExpenses';
import { PastDays } from './PastDays';
import { AddExpenseFab } from './AddExpenseFab';

export default function TrackerPage() {
  const salary = usePlanStore((s) => s.salary);
  const paidOn = usePlanStore((s) => s.paidOn);
  const config = usePlanStore((s) => s.config);
  const expenses = useTrackerStore((s) => s.expenses);

  const { summary, todayExpenses, pastDays } = useMemo(() => {
    const today = todayISO();
    const result = allocateSalary(salary, config, { paidOn: paidOn || undefined });
    const scoped = result.period ? expensesInPeriod(expenses, result.period) : expenses;
    return {
      summary: summarizeSpending(result, scoped, { asOf: today }),
      todayExpenses: scoped.filter((expense) => expense.date === today),
      pastDays: expensesByDay(scoped.filter((expense) => expense.date < today)),
    };
  }, [salary, paidOn, config, expenses]);

  return (
    <div className="flex flex-col gap-4 pb-24">
      <SpendingSummaryCard summary={summary} hasSalary={salary > 0} />
      <RecentExpenses expenses={todayExpenses} currency={config.currency} />
      <PastDays days={pastDays} currency={config.currency} />
      <AddExpenseFab />
    </div>
  );
}
