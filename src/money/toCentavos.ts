/** Convert major currency units (e.g. 15601.98) to integer centavos (1560198). */
export function toCentavos(major: number): number {
  return Math.round(major * 100);
}
