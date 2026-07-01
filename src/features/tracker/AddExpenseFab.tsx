import { useEffect, useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import { mergedCategories } from '../../core';
import { useTrackerStore } from '../../store/trackerStore';
import { CategoryIcon } from './CategoryIcon';
import { CategoryQuickPanel } from './CategoryQuickPanel';

/** Arc geometry for the fanned-out category circles. The FAB sits in the corner,
 *  so the circles fan through the reachable quarter (left → straight up) and
 *  never run off the right edge; the radius grows as categories are added. */
function bubbleOffset(index: number, count: number): { dx: number; dy: number } {
  const radius = 130 + Math.max(0, count - 3) * 24;
  const start = 182;
  const end = 268;
  const t = count <= 1 ? 0.5 : index / (count - 1);
  const angle = ((start + t * (end - start)) * Math.PI) / 180;
  return { dx: radius * Math.cos(angle), dy: radius * Math.sin(angle) };
}

/** Floating add button in the thumb zone. Tap to fan out category circles; pick
 *  one to open its quick-add popup (saved items + a new-item form). */
export function AddExpenseFab() {
  const storedCategories = useTrackerStore((s) => s.categories);
  const savedItems = useTrackerStore((s) => s.savedItems);
  const categoryIcons = useTrackerStore((s) => s.categoryIcons);

  const categories = useMemo(
    () => mergedCategories(storedCategories, savedItems),
    [storedCategories, savedItems],
  );

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  function close() {
    setOpen(false);
    setSelected(null);
  }

  // Layered dismiss: Esc backs out of the panel to the circles, then closes.
  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key !== 'Escape') return;
      if (selected) setSelected(null);
      else setOpen(false);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, selected]);

  // Portal to <body> so `position: fixed` is viewport-relative — the page
  // container keeps a transform (slide animation), which would otherwise make
  // fixed children anchor to it and float mid-screen.
  return createPortal(
    <>
      {open ? <div className="fab-backdrop" onClick={close} aria-hidden="true" /> : null}

      <div className={`fab-root${open ? ' fab-root--open' : ''}`}>
        {open && !selected
          ? categories.map((category, index) => {
              const { dx, dy } = bubbleOffset(index, categories.length);
              return (
                <div
                  key={category}
                  className="fab-bubble-wrap"
                  style={{ '--dx': `${dx}px`, '--dy': `${dy}px`, '--d': `${index * 32}ms` } as CSSProperties}
                >
                  <button
                    type="button"
                    className="fab-bubble"
                    onClick={() => setSelected(category)}
                    aria-label={`Add to ${category}`}
                  >
                    <CategoryIcon iconKey={categoryIcons[category]} size={24} />
                  </button>
                  <span className="fab-bubble__name">{category}</span>
                </div>
              );
            })
          : null}

        <button
          type="button"
          className="fab"
          onClick={() => (open ? close() : setOpen(true))}
          aria-label={open ? 'Close' : 'Add expense'}
          aria-expanded={open}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
      </div>

      {selected ? (
        <div className="fab-panel" role="dialog" aria-label={`Add to ${selected}`}>
          <div className="fab-panel__head">
            <button
              type="button"
              className="fab-panel__back"
              onClick={() => setSelected(null)}
              aria-label="Back to categories"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <span className="fab-panel__icon">
              <CategoryIcon iconKey={categoryIcons[selected]} size={20} />
            </span>
            <span className="fab-panel__title">{selected}</span>
            <button type="button" className="fab-panel__close" onClick={close} aria-label="Close">
              ✕
            </button>
          </div>
          <CategoryQuickPanel category={selected} onLogged={close} />
        </div>
      ) : null}
    </>,
    document.body,
  );
}
