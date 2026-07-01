import { CATEGORY_ICON_OPTIONS, CategoryIcon } from './CategoryIcon';

/** A grid of category glyphs to choose from. Controlled by the caller. */
export function IconPicker({
  value,
  onPick,
}: {
  value?: string;
  onPick: (key: string) => void;
}) {
  return (
    <div className="icon-picker" role="radiogroup" aria-label="Category icon">
      {CATEGORY_ICON_OPTIONS.map((option) => (
        <button
          key={option.key}
          type="button"
          role="radio"
          aria-checked={value === option.key}
          aria-label={option.label}
          title={option.label}
          className={`icon-picker__cell${value === option.key ? ' icon-picker__cell--active' : ''}`}
          onClick={() => onPick(option.key)}
        >
          <CategoryIcon iconKey={option.key} size={20} />
        </button>
      ))}
    </div>
  );
}
