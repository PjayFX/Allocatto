import { useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';

export interface CoverFlowItem {
  id: string;
  node: ReactNode;
}

/** Tunable geometry for the side (peeking) cards, so the same switcher can feel
 *  bold (dashboard charts) or subtle (a sliver-peek of past pays). */
export interface CoverFlowLayout {
  shift: number; // % translateX per step
  depth: number; // px pushed back
  angle: number; // deg rotateY
  lift: number; // px dropped down
  minScale: number;
  nearOpacity: number; // immediate neighbors
  farOpacity: number; // two steps out
}

const DEFAULT_LAYOUT: CoverFlowLayout = {
  shift: 46,
  depth: 160,
  angle: 38,
  lift: 18,
  minScale: 0.82,
  nearOpacity: 0.9,
  farOpacity: 0.5,
};

function cardStyle(delta: number, layout: CoverFlowLayout): CSSProperties {
  const abs = Math.abs(delta);
  const rotate = delta === 0 ? 0 : delta > 0 ? -layout.angle : layout.angle;
  return {
    transform: `translate(-50%, -50%) translateX(${delta * layout.shift}%) translateZ(${
      abs === 0 ? 0 : -layout.depth
    }px) rotateY(${rotate}deg) translateY(${abs === 0 ? 0 : layout.lift}px) scale(${
      abs === 0 ? 1 : layout.minScale
    })`,
    opacity: abs > 2 ? 0 : abs === 0 ? 1 : abs === 1 ? layout.nearOpacity : layout.farOpacity,
    zIndex: 20 - abs,
    pointerEvents: abs > 2 ? 'none' : 'auto',
  };
}

/** Cover Flow-style switcher: the active panel sits upright and centered while
 *  neighbors shrink and angle away to the sides. Tap a side panel or a dot to
 *  bring it to the center. */
/** Shortest signed distance from `active` to `i` around a ring of `n` items,
 *  so the carousel wraps instead of dead-ending at the edges. */
function circularDelta(i: number, active: number, n: number): number {
  let delta = i - active;
  if (delta > n / 2) delta -= n;
  if (delta < -n / 2) delta += n;
  return delta;
}

export function CoverFlow({
  items,
  initial,
  layout,
  className,
}: {
  items: CoverFlowItem[];
  initial?: number;
  layout?: Partial<CoverFlowLayout>;
  className?: string;
}) {
  const [active, setActive] = useState(initial ?? Math.floor(items.length / 2));
  const merged = { ...DEFAULT_LAYOUT, ...layout };

  return (
    <div className={`coverflow${className ? ` ${className}` : ''}`}>
      <div className="coverflow__stage">
        {items.map((item, i) => {
          const delta = circularDelta(i, active, items.length);
          const isActive = delta === 0;
          return (
            <div
              key={item.id}
              className={`cf-card${isActive ? ' cf-card--active' : ''}`}
              style={cardStyle(delta, merged)}
              onClick={isActive ? undefined : () => setActive(i)}
              role={isActive ? undefined : 'button'}
              aria-hidden={Math.abs(delta) > 2}
              tabIndex={isActive ? undefined : 0}
              onKeyDown={
                isActive
                  ? undefined
                  : (event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        setActive(i);
                      }
                    }
              }
            >
              {item.node}
            </div>
          );
        })}
      </div>
    </div>
  );
}
