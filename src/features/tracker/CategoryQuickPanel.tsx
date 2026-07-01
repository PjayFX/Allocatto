import { useMemo, useState } from 'react';
import type { KeyboardEvent } from 'react';
import type { SavedItem } from '../../core';
import { formatMoney, rankSavedItemsByUsage, toCentavos } from '../../core';
import { useTrackerStore } from '../../store/trackerStore';
import { usePlanStore } from '../../store/planStore';
import { NumberField } from '../../components/NumberField';

const MAX_TILES = 9;

function ItemTile({
  item,
  currency,
  onLogged,
}: {
  item: SavedItem;
  currency: string;
  onLogged: () => void;
}) {
  const logSavedItem = useTrackerStore((s) => s.logSavedItem);
  return (
    <button
      type="button"
      className="quick-tile"
      onClick={() => {
        logSavedItem(item.id);
        onLogged();
      }}
    >
      <span className="quick-tile__label truncate">{item.label}</span>
      <span className="quick-tile__amount tabular-nums">
        {formatMoney(toCentavos(item.amount), currency)}
      </span>
      <span className="quick-tile__add" aria-hidden="true">
        +
      </span>
    </button>
  );
}

function NewItemForm({
  category,
  autoFocusAmount,
  onLogged,
}: {
  category: string;
  autoFocusAmount: boolean;
  onLogged: () => void;
}) {
  const addExpense = useTrackerStore((s) => s.addExpense);
  const currency = usePlanStore((s) => s.config.currency);
  const [label, setLabel] = useState('');
  const [amount, setAmount] = useState(0);

  function submit() {
    if (amount <= 0) return;
    addExpense({ amount, category, note: label });
    onLogged();
  }

  function onEnter(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') submit();
  }

  return (
    <div className="flex flex-col gap-2">
      <input
        className="input"
        placeholder="What did you buy? (optional)"
        value={label}
        onChange={(event) => setLabel(event.target.value)}
        onKeyDown={onEnter}
        aria-label="Expense name"
      />
      <div className="flex items-center gap-2">
        <div className="input-affix flex-1">
          <span className="affix">{currency}</span>
          <NumberField
            className="affix-input"
            value={amount}
            onChange={setAmount}
            onKeyDown={onEnter}
            autoFocus={autoFocusAmount}
            aria-label="Expense amount"
          />
        </div>
        <button type="button" className="btn btn-primary" onClick={submit}>
          Log
        </button>
      </div>
    </div>
  );
}

/** The saved-item tiles + new-item form for one category. Logging anything
 *  calls onLogged so the caller (the FAB popup) can close. */
export function CategoryQuickPanel({
  category,
  onLogged,
}: {
  category: string;
  onLogged: () => void;
}) {
  const savedItems = useTrackerStore((s) => s.savedItems);
  const expenses = useTrackerStore((s) => s.expenses);
  const currency = usePlanStore((s) => s.config.currency);

  const items = useMemo(
    () =>
      rankSavedItemsByUsage(
        savedItems.filter((item) => item.category === category),
        expenses,
      ).slice(0, MAX_TILES),
    [savedItems, expenses, category],
  );

  return (
    <div className="flex flex-col gap-3">
      {items.length > 0 ? (
        <div className="quick-grid">
          {items.map((item) => (
            <ItemTile key={item.id} item={item} currency={currency} onLogged={onLogged} />
          ))}
        </div>
      ) : (
        <p className="text-faint text-sm">No saved items yet — log one below.</p>
      )}
      <NewItemForm category={category} autoFocusAmount={items.length === 0} onLogged={onLogged} />
    </div>
  );
}
