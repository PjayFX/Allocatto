import type { SavedItem } from '../../core';
import { useTrackerStore } from '../../store/trackerStore';
import { NumberField } from '../../components/NumberField';

/** Editable row for one saved quick-item — used in both the Quick Add manage
 *  mode and the centralized category manager. */
export function SavedItemRow({ item, currency }: { item: SavedItem; currency: string }) {
  const updateSavedItem = useTrackerStore((s) => s.updateSavedItem);
  const removeSavedItem = useTrackerStore((s) => s.removeSavedItem);
  return (
    <div className="flex items-center gap-2">
      <input
        className="input min-w-0 flex-1"
        value={item.label}
        onChange={(event) => updateSavedItem(item.id, { label: event.target.value })}
        aria-label="Item name"
      />
      <div className="input-affix" style={{ width: '7.5rem' }}>
        <span className="affix">{currency}</span>
        <NumberField
          className="affix-input"
          value={item.amount}
          onChange={(next) => updateSavedItem(item.id, { amount: next })}
          aria-label={`${item.label} amount`}
        />
      </div>
      <button
        type="button"
        className="icon-btn"
        onClick={() => removeSavedItem(item.id)}
        aria-label={`Remove ${item.label}`}
      >
        ✕
      </button>
    </div>
  );
}
