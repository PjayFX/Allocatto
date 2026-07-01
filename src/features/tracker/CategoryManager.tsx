import { useState } from 'react';
import type { KeyboardEvent } from 'react';
import type { SavedItem } from '../../core';
import { mergedCategories } from '../../core';
import { useTrackerStore } from '../../store/trackerStore';
import { usePlanStore } from '../../store/planStore';
import { NumberField } from '../../components/NumberField';
import { SavedItemRow } from './SavedItemRow';
import { CategoryIcon, DEFAULT_CATEGORY_ICON } from './CategoryIcon';
import { IconPicker } from './IconPicker';

function AddItemRow({ category }: { category: string }) {
  const addSavedItem = useTrackerStore((s) => s.addSavedItem);
  const currency = usePlanStore((s) => s.config.currency);
  const [label, setLabel] = useState('');
  const [amount, setAmount] = useState(0);

  function submit() {
    if (!label.trim() || amount <= 0) return;
    addSavedItem({ label: label.trim(), amount, category });
    setLabel('');
    setAmount(0);
  }

  return (
    <div className="flex items-center gap-2">
      <input
        className="input min-w-0 flex-1"
        placeholder="Add item"
        value={label}
        onChange={(event) => setLabel(event.target.value)}
        aria-label={`New ${category} item`}
      />
      <div className="input-affix" style={{ width: '7.5rem' }}>
        <span className="affix">{currency}</span>
        <NumberField
          className="affix-input"
          value={amount}
          onChange={setAmount}
          aria-label="New item amount"
        />
      </div>
      <button type="button" className="icon-btn" onClick={submit} aria-label="Add item">
        +
      </button>
    </div>
  );
}

function CategoryBlock({
  category,
  items,
  currency,
}: {
  category: string;
  items: SavedItem[];
  currency: string;
}) {
  const renameCategory = useTrackerStore((s) => s.renameCategory);
  const removeCategory = useTrackerStore((s) => s.removeCategory);
  const icon = useTrackerStore((s) => s.categoryIcons[category]);
  const setCategoryIcon = useTrackerStore((s) => s.setCategoryIcon);
  const [name, setName] = useState(category);
  const [confirming, setConfirming] = useState(false);
  const [pickingIcon, setPickingIcon] = useState(false);

  function commitRename() {
    const next = name.trim();
    if (next && next !== category) renameCategory(category, next);
    else setName(category);
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') event.currentTarget.blur();
    if (event.key === 'Escape') {
      setName(category);
      event.currentTarget.blur();
    }
  }

  return (
    <div className="cat-mgr__block">
      <div className="flex items-center gap-2">
        <button
          type="button"
          className={`cat-icon-btn${pickingIcon ? ' cat-icon-btn--active' : ''}`}
          onClick={() => setPickingIcon((v) => !v)}
          aria-label={`Change ${category} icon`}
        >
          <CategoryIcon iconKey={icon} size={20} />
        </button>
        <input
          className="input cat-mgr__name min-w-0 flex-1"
          value={name}
          onChange={(event) => setName(event.target.value)}
          onBlur={commitRename}
          onKeyDown={onKeyDown}
          aria-label="Category name"
        />
        {confirming ? (
          <>
            <button
              type="button"
              className="ghost-btn ghost-btn--danger text-xs"
              onClick={() => removeCategory(category)}
            >
              Delete
            </button>
            <button
              type="button"
              className="ghost-btn text-xs"
              onClick={() => setConfirming(false)}
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            type="button"
            className="icon-btn"
            onClick={() => setConfirming(true)}
            aria-label={`Delete ${category}`}
          >
            ✕
          </button>
        )}
      </div>
      {pickingIcon ? (
        <div className="mt-2">
          <IconPicker
            value={icon}
            onPick={(key) => {
              setCategoryIcon(category, key);
              setPickingIcon(false);
            }}
          />
        </div>
      ) : null}
      <div className="mt-2 flex flex-col gap-2">
        {items.map((item) => (
          <SavedItemRow key={item.id} item={item} currency={currency} />
        ))}
        <AddItemRow category={category} />
      </div>
    </div>
  );
}

function AddCategoryRow() {
  const addCategory = useTrackerStore((s) => s.addCategory);
  const [name, setName] = useState('');
  const [icon, setIcon] = useState(DEFAULT_CATEGORY_ICON);

  function submit() {
    if (!name.trim()) return;
    addCategory(name.trim(), icon);
    setName('');
    setIcon(DEFAULT_CATEGORY_ICON);
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') submit();
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <input
          className="input min-w-0 flex-1"
          placeholder="New category"
          value={name}
          onChange={(event) => setName(event.target.value)}
          onKeyDown={onKeyDown}
          aria-label="New category name"
        />
        <button type="button" className="btn btn-soft" onClick={submit}>
          Add
        </button>
      </div>
      <IconPicker value={icon} onPick={setIcon} />
    </div>
  );
}

export function CategoryManager() {
  const savedItems = useTrackerStore((s) => s.savedItems);
  const storedCategories = useTrackerStore((s) => s.categories);
  const currency = usePlanStore((s) => s.config.currency);
  const categories = mergedCategories(storedCategories, savedItems);

  return (
    <div className="cat-mgr">
      {categories.map((category) => (
        <CategoryBlock
          key={category}
          category={category}
          items={savedItems.filter((item) => item.category === category)}
          currency={currency}
        />
      ))}
      <div className="cat-mgr__new">
        <h3 className="field-label mb-2">New category</h3>
        <AddCategoryRow />
      </div>
    </div>
  );
}
