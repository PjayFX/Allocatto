import type { AllocationRule, Bucket } from '../../core';
import { usePlanStore } from '../../store/planStore';
import { NumberField } from '../../components/NumberField';
import { QrUpload } from '../../components/QrUpload';
import { bucketColor } from './bucketColors';

function ruleValue(rule: AllocationRule): number {
  return rule.kind === 'amount' ? rule.amount : rule.percent;
}

function makeRule(kind: AllocationRule['kind'], value: number): AllocationRule {
  return kind === 'amount' ? { kind: 'amount', amount: value } : { kind: 'percentage', percent: value };
}

function TrashIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 7h16M9 7V5h6v2M7 7l1 13h8l1-13" />
    </svg>
  );
}

function BucketRow({ bucket, color }: { bucket: Bucket; color: string }) {
  const currency = usePlanStore((s) => s.config.currency);
  const renameBucket = usePlanStore((s) => s.renameBucket);
  const setBucketRule = usePlanStore((s) => s.setBucketRule);
  const setBucketQrPh = usePlanStore((s) => s.setBucketQrPh);
  const removeBucket = usePlanStore((s) => s.removeBucket);

  const isPercent = bucket.rule.kind === 'percentage';
  const value = ruleValue(bucket.rule);

  return (
    <div className="bucket-row">
      <div className="flex items-center gap-2.5">
        <span className="bucket-dot" style={{ background: color }} />
        <input
          className="input min-w-0 flex-1 bg-[var(--surface)]"
          value={bucket.name}
          onChange={(event) => renameBucket(bucket.id, event.target.value)}
          aria-label="Bucket name"
        />
        <button
          type="button"
          className="icon-btn"
          onClick={() => removeBucket(bucket.id)}
          aria-label={`Remove ${bucket.name}`}
        >
          <TrashIcon />
        </button>
      </div>

      <div className="flex items-center gap-2">
        <div className="seg" role="group" aria-label="Allocation type">
          <button
            type="button"
            className={`seg__btn${isPercent ? '' : ' active'}`}
            onClick={() => setBucketRule(bucket.id, makeRule('amount', value))}
          >
            Amount
          </button>
          <button
            type="button"
            className={`seg__btn${isPercent ? ' active' : ''}`}
            onClick={() => setBucketRule(bucket.id, makeRule('percentage', value))}
          >
            Percent
          </button>
        </div>

        <div className="input-affix flex-1">
          {!isPercent && <span className="affix">{currency}</span>}
          <NumberField
            className="affix-input"
            value={value}
            onChange={(next) => setBucketRule(bucket.id, makeRule(bucket.rule.kind, next))}
            aria-label={`${bucket.name} value`}
          />
          {isPercent && <span className="affix">%</span>}
        </div>
      </div>

      <QrUpload qrPh={bucket.qrPh} onSet={(qrPh) => setBucketQrPh(bucket.id, qrPh)} />
    </div>
  );
}

export function BucketEditor() {
  const buckets = usePlanStore((s) => s.config.buckets);
  const addBucket = usePlanStore((s) => s.addBucket);
  const allowanceQrPh = usePlanStore((s) => s.allowanceQrPh);
  const setAllowanceQrPh = usePlanStore((s) => s.setAllowanceQrPh);

  return (
    <div>
      <h3 className="field-label mb-3">Categories</h3>
      <div className="flex flex-col">
        {buckets.map((bucket, index) => (
          <BucketRow key={bucket.id} bucket={bucket} color={bucketColor(index)} />
        ))}
      </div>
      <button type="button" onClick={addBucket} className="btn-add mt-3">
        + Add category
      </button>

      <h3 className="field-label mt-6 mb-3">Allowance destination</h3>
      <QrUpload qrPh={allowanceQrPh} onSet={setAllowanceQrPh} label="allowance" />
    </div>
  );
}
