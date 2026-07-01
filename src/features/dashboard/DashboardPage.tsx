import { useMemo } from 'react';
import type { Paycheck } from '../../core';
import {
  addDays,
  allocateSalary,
  dailyTotals,
  expensesInPeriod,
  ledgerEntries,
  salaryInsights,
  savingsTimeline,
  sumExpenses,
  todayISO,
  totalsByCategory,
} from '../../core';
import { usePlanStore } from '../../store/planStore';
import { useTrackerStore } from '../../store/trackerStore';
import { Insights } from './Insights';
import { CoverFlow } from './CoverFlow';
import { DailySpendingChart } from './DailySpendingChart';
import { CategoryChart } from './CategoryChart';
import { SavingsChart } from './SavingsChart';
import { TransactionList } from './TransactionList';

export default function DashboardPage() {
  const salary = usePlanStore((s) => s.salary);
  const paidOn = usePlanStore((s) => s.paidOn);
  const config = usePlanStore((s) => s.config);
  const payHistory = usePlanStore((s) => s.payHistory);
  const expenses = useTrackerStore((s) => s.expenses);
  const savings = useTrackerStore((s) => s.savings);

  const view = useMemo(() => {
    const today = todayISO();
    const result = allocateSalary(salary, config, { paidOn: paidOn || undefined });
    const period = result.period;
    const start = period ? period.start : addDays(today, -13);
    const end = period ? period.end : addDays(today, 1);

    const scoped = period ? expensesInPeriod(expenses, period) : expenses;
    const ranked = totalsByCategory(scoped).sort((a, b) => b.amount - a.amount);

    const allPaychecks: Paycheck[] = [
      ...payHistory,
      ...(salary > 0 ? [{ id: 'current', amount: salary, date: paidOn }] : []),
    ];

    return {
      days: dailyTotals(scoped, start, end),
      perDay: result.perDay,
      totalSpent: sumExpenses(scoped),
      categoryTotals: ranked,
      topCategory: ranked[0],
      savingsPoints: savingsTimeline(savings),
      salary: salaryInsights(allPaychecks),
      ledger: ledgerEntries(allPaychecks, expenses, savings),
      periodLabel: period ? `${period.days} days · ${period.start} → ${period.end}` : 'Last 14 days',
    };
  }, [salary, paidOn, config, payHistory, expenses, savings]);

  const currency = config.currency;

  const panels = [
    {
      id: 'category',
      node: <CategoryChart totals={view.categoryTotals} currency={currency} />,
    },
    {
      id: 'daily',
      node: (
        <DailySpendingChart
          days={view.days}
          perDay={view.perDay}
          totalSpent={view.totalSpent}
          currency={currency}
          periodLabel={view.periodLabel}
        />
      ),
    },
    {
      id: 'savings',
      node: <SavingsChart points={view.savingsPoints} currency={currency} />,
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <Insights
        salary={view.salary}
        topCategory={view.topCategory}
        totalSpent={view.totalSpent}
        currency={currency}
      />
      <CoverFlow items={panels} initial={1} />
      <TransactionList entries={view.ledger} currency={currency} />
    </div>
  );
}
