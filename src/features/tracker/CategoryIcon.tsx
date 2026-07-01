import type { ReactNode } from 'react';

/** Curated line-glyph set for categories — monochrome, stroke-based to match
 *  the app's other icons. Keys are stored on categories via `categoryIcons`. */
const GLYPHS: Record<string, ReactNode> = {
  food: (
    <>
      <path d="M6 3v6a2 2 0 0 0 4 0V3" />
      <path d="M8 11v10" />
      <path d="M16 3c-1.5 1.2-2 3.2-2 5.2S14.5 11 16 11v10" />
    </>
  ),
  basket: (
    <>
      <path d="M4 9h16l-1.4 10.2a1 1 0 0 1-1 .8H6.4a1 1 0 0 1-1-.8L4 9Z" />
      <path d="M9 9 11 4M15 9 13 4" />
    </>
  ),
  transport: (
    <>
      <path d="M5 11l1.4-4A2 2 0 0 1 8.3 6h7.4a2 2 0 0 1 1.9 1.3L19 11" />
      <rect x="3" y="11" width="18" height="6" rx="1.5" />
      <circle cx="7.5" cy="17" r="1.5" />
      <circle cx="16.5" cy="17" r="1.5" />
    </>
  ),
  fuel: (
    <>
      <path d="M5 21V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v16" />
      <path d="M4 21h11" />
      <path d="M7 9h4" />
      <path d="M13 8l4 4v5a2 2 0 0 0 4 0V10l-3-3" />
    </>
  ),
  home: (
    <>
      <path d="M4 11 12 4l8 7" />
      <path d="M6 10v9h12v-9" />
    </>
  ),
  bills: (
    <>
      <path d="M6 3h12v18l-2-1.3-2 1.3-2-1.3L10 21l-2-1.3L6 21Z" />
      <path d="M9 8h6M9 12h6" />
    </>
  ),
  health: <path d="M12 20s-7-4.5-7-9.5A3.5 3.5 0 0 1 12 7a3.5 3.5 0 0 1 7 3.5C19 15.5 12 20 12 20Z" />,
  shopping: (
    <>
      <path d="M6 8h12l-1 12H7L6 8Z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </>
  ),
  coffee: (
    <>
      <path d="M4 8h13v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V8Z" />
      <path d="M17 9h2a2 2 0 0 1 0 4h-2" />
      <path d="M7 3v2M11 3v2" />
    </>
  ),
  fun: (
    <>
      <circle cx="7" cy="18" r="2.2" />
      <circle cx="17" cy="16" r="2.2" />
      <path d="M9.2 18V6l10-2v10" />
    </>
  ),
  gift: (
    <>
      <rect x="4" y="9" width="16" height="11" rx="1" />
      <path d="M4 13h16M12 9v11" />
      <path d="M12 9C10.5 9 8 8.5 8 6.5S11 4 12 9Zm0 0c1.5 0 4-.5 4-2.5S13 4 12 9Z" />
    </>
  ),
  phone: (
    <>
      <rect x="7" y="3" width="10" height="18" rx="2" />
      <path d="M11 18h2" />
    </>
  ),
  education: (
    <>
      <path d="M3 9 12 5l9 4-9 4-9-4Z" />
      <path d="M7 11v4c0 1 2.5 2 5 2s5-1 5-2v-4" />
    </>
  ),
  pets: (
    <>
      <circle cx="8" cy="9" r="1.5" />
      <circle cx="16" cy="9" r="1.5" />
      <circle cx="5.5" cy="13" r="1.3" />
      <circle cx="18.5" cy="13" r="1.3" />
      <path d="M12 12c-2.4 0-4.3 1.9-4.3 4C7.7 17.9 9.2 19 12 19s4.3-1.1 4.3-3C16.3 13.9 14.4 12 12 12Z" />
    </>
  ),
  coins: (
    <>
      <ellipse cx="12" cy="6" rx="7" ry="3" />
      <path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6" />
      <path d="M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" />
    </>
  ),
  tag: (
    <>
      <path d="M20.6 13.4 12 22l-9-9V3h10l7.6 7.6a2 2 0 0 1 0 2.8Z" />
      <circle cx="7.5" cy="7.5" r="1.4" />
    </>
  ),
};

/** The default glyph when a category has no icon set. */
export const DEFAULT_CATEGORY_ICON = 'tag';

/** Picker options in display order. */
export const CATEGORY_ICON_OPTIONS: { key: string; label: string }[] = [
  { key: 'food', label: 'Food' },
  { key: 'basket', label: 'Groceries' },
  { key: 'coffee', label: 'Coffee' },
  { key: 'transport', label: 'Transport' },
  { key: 'fuel', label: 'Fuel' },
  { key: 'home', label: 'Home' },
  { key: 'bills', label: 'Bills' },
  { key: 'shopping', label: 'Shopping' },
  { key: 'health', label: 'Health' },
  { key: 'education', label: 'Education' },
  { key: 'phone', label: 'Phone' },
  { key: 'fun', label: 'Fun' },
  { key: 'gift', label: 'Gifts' },
  { key: 'pets', label: 'Pets' },
  { key: 'coins', label: 'Savings' },
  { key: 'tag', label: 'Other' },
];

export function CategoryIcon({ iconKey, size = 20 }: { iconKey?: string; size?: number }) {
  const glyph = (iconKey && GLYPHS[iconKey]) || GLYPHS[DEFAULT_CATEGORY_ICON];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {glyph}
    </svg>
  );
}
