import type { AllocationResult } from '../../core';
import { buildSegments } from './allocationSegments';

/** The horizontal stacked bar of an allocation (buckets + allowance). */
export function AllocationBar({ result }: { result: AllocationResult }) {
  const segments = buildSegments(result);
  return (
    <div
      className="mt-4 flex h-2.5 w-full overflow-hidden rounded-full"
      style={{ background: 'var(--surface-3)' }}
    >
      {segments.map((segment) => (
        <span key={segment.key} style={{ width: `${segment.width}%`, background: segment.color }} />
      ))}
    </div>
  );
}
