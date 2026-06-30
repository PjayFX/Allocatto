/** Convert integer centavos (1560198) back to major units with 2-decimal precision (15601.98). */
export function fromCentavos(centavos: number): number {
  return Math.round(centavos) / 100;
}
