import { useMemo } from 'react';
import { allocateSalary } from '../../core';
import { usePlanStore } from '../../store/planStore';
import { PayCarousel } from './PayCarousel';
import { AllocationSummary } from './AllocationSummary';
import { PaymentQrs } from './PaymentQrs';

export default function PlannerPage() {
  const salary = usePlanStore((s) => s.salary);
  const paidOn = usePlanStore((s) => s.paidOn);
  const config = usePlanStore((s) => s.config);

  const result = useMemo(
    () => allocateSalary(salary, config, { paidOn: paidOn || undefined }),
    [salary, paidOn, config],
  );

  return (
    <div className="flex flex-col gap-4">
      <PayCarousel />
      {salary > 0 ? <AllocationSummary result={result} /> : null}
      {salary > 0 ? <PaymentQrs result={result} /> : null}
    </div>
  );
}
