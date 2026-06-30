import type { AllocationResult, CurrencyCode, PaymentGroup, PaymentItem } from '../../core';
import { groupPayments, injectAmount } from '../../core';
import { usePlanStore } from '../../store/planStore';
import { MoneyText } from '../../components/MoneyText';
import { useQrDataUrl } from '../../components/useQrDataUrl';

function DownloadIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3v12M7 10l5 5 5-5M5 21h14" />
    </svg>
  );
}

/** Collect every destination with a linked QR: buckets plus the allowance. */
function paymentItems(result: AllocationResult, allowanceQrPh?: string): PaymentItem[] {
  const items: PaymentItem[] = result.allocations
    .filter((allocation) => allocation.bucket.qrPh && allocation.amount > 0)
    .map((allocation) => ({
      label: allocation.bucket.name,
      amountCentavos: allocation.amount,
      qrPh: allocation.bucket.qrPh as string,
    }));
  if (allowanceQrPh && result.allowance > 0) {
    items.push({ label: 'Allowance', amountCentavos: result.allowance, qrPh: allowanceQrPh });
  }
  return items;
}

function PaymentWindow({ group, currency }: { group: PaymentGroup; currency: CurrencyCode }) {
  const title = group.recipientName ?? group.labels.join(' + ');
  const dynamic = injectAmount(group.qrPh, { amountCentavos: group.amountCentavos });
  const src = useQrDataUrl(dynamic, 240);
  const fileName = `${title}-${(group.amountCentavos / 100).toFixed(2)}.png`;

  return (
    <section className="card">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col">
          <span className="truncate font-medium">{title}</span>
          <span className="text-faint text-xs">{group.labels.join(' + ')}</span>
          <span className="mt-1 tabular-nums">
            <MoneyText centavos={group.amountCentavos} currency={currency} />
          </span>
        </div>
        {src ? (
          <a
            className="qr-download"
            href={src}
            download={fileName}
            aria-label="Download QR"
            title="Download QR"
          >
            <DownloadIcon />
          </a>
        ) : null}
      </div>
      {src ? (
        <div className="qr-block">
          <img src={src} alt={`QR for ${title}`} width={240} height={240} className="qr-img" />
        </div>
      ) : null}
    </section>
  );
}

export function PaymentQrs({ result }: { result: AllocationResult }) {
  const allowanceQrPh = usePlanStore((s) => s.allowanceQrPh);
  const groups = groupPayments(paymentItems(result, allowanceQrPh));

  return (
    <>
      {groups.map((group) => (
        <PaymentWindow key={group.qrPh} group={group} currency={result.currency} />
      ))}
    </>
  );
}
