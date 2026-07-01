import { useState } from 'react';
import type { LedgerEntry, LedgerKind } from '../../core';
import { formatMoney, ledgerToCsv, todayISO } from '../../core';
import { Card } from '../../components/Card';

const KIND_META: Record<LedgerKind, string> = {
  pay: 'Income',
  expense: 'Spend',
  deposit: 'To savings',
  withdrawal: 'From savings',
};

interface Group {
  key: string;
  title: string;
  entries: LedgerEntry[];
  net: number;
}

/** Signed net of a set of entries (in adds, out subtracts), in centavos. */
function netOf(entries: LedgerEntry[]): number {
  return entries.reduce((sum, e) => sum + (e.direction === 'in' ? e.amount : -e.amount), 0);
}

/** Split the feed into the three record types, keeping only non-empty groups. */
function groupEntries(entries: LedgerEntry[]): Group[] {
  const of = (...kinds: LedgerKind[]) => entries.filter((e) => kinds.includes(e.kind));
  return [
    { key: 'salary', title: 'Salary', entries: of('pay') },
    { key: 'savings', title: 'Savings', entries: of('deposit', 'withdrawal') },
    { key: 'expenses', title: 'Daily expenses', entries: of('expense') },
  ]
    .filter((group) => group.entries.length > 0)
    .map((group) => ({ ...group, net: netOf(group.entries) }));
}

function metaLine(entry: LedgerEntry): string {
  const parts = [KIND_META[entry.kind]];
  if (entry.kind === 'expense' && entry.sublabel) parts.push(entry.sublabel);
  parts.push(entry.date);
  return parts.join(' · ');
}

function SignedMoney({
  centavos,
  direction,
  currency,
}: {
  centavos: number;
  direction: 'in' | 'out';
  currency: string;
}) {
  const incoming = direction === 'in';
  return (
    <span className={`font-medium tabular-nums ${incoming ? 'text-success' : 'text-danger'}`}>
      {incoming ? '+' : '−'}
      {formatMoney(centavos, currency)}
    </span>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      className={`rec-chevron${open ? ' rec-chevron--open' : ''}`}
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}

function RecordGroup({ group, currency }: { group: Group; currency: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rec-group">
      <button
        type="button"
        className="rec-group__head"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span className="rec-group__name">
          {group.title}
          <span className="text-faint ml-2 text-xs">{group.entries.length}</span>
        </span>
        <span className="flex items-center gap-2.5">
          <SignedMoney
            centavos={Math.abs(group.net)}
            direction={group.net >= 0 ? 'in' : 'out'}
            currency={currency}
          />
          <Chevron open={open} />
        </span>
      </button>

      {open ? (
        <ul className="flex flex-col pb-1">
          {group.entries.map((entry) => (
            <li key={entry.id} className="rec-row">
              <div className="flex min-w-0 flex-col">
                <span className="truncate">{entry.label}</span>
                <span className="text-faint text-xs">{metaLine(entry)}</span>
              </div>
              <span className="ml-auto">
                <SignedMoney centavos={entry.amount} direction={entry.direction} currency={currency} />
              </span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function downloadCsv(entries: LedgerEntry[]) {
  const blob = new Blob([ledgerToCsv(entries)], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `allocatto-records-${todayISO()}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

/** The full record, grouped by type into expandable sections, with CSV export. */
export function TransactionList({
  entries,
  currency,
}: {
  entries: LedgerEntry[];
  currency: string;
}) {
  const groups = groupEntries(entries);

  return (
    <Card title="Records" plain>
      <div className="mb-1 flex items-center justify-between">
        <span className="field-label">{entries.length} entries</span>
        {entries.length > 0 ? (
          <button type="button" className="ghost-btn text-xs" onClick={() => downloadCsv(entries)}>
            Export CSV
          </button>
        ) : null}
      </div>

      {groups.length === 0 ? (
        <p className="text-faint mt-4 text-sm">No transactions yet.</p>
      ) : (
        <div className="rec-groups">
          {groups.map((group) => (
            <RecordGroup key={group.key} group={group} currency={currency} />
          ))}
        </div>
      )}
    </Card>
  );
}
