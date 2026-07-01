import type { SavedItem } from '../types';

/** Categories the user can pick from: their stored list plus any category that
 *  only exists implicitly through a saved item, de-duplicated in stored-first
 *  order so the picker stays stable. */
export function mergedCategories(stored: string[], items: SavedItem[]): string[] {
  return [...new Set([...stored, ...items.map((item) => item.category)])];
}
