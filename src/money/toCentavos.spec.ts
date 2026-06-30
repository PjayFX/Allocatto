import { describe, it, expect } from 'vitest';
import { toCentavos } from './toCentavos';
import { fromCentavos } from './fromCentavos';

describe('centavos conversion', () => {
  it('rounds major units to integer centavos (no float drift)', () => {
    expect(toCentavos(15601.98)).toBe(1560198);
    expect(toCentavos(5000)).toBe(500000);
  });

  it('round-trips back to 2-decimal major units', () => {
    expect(fromCentavos(660198)).toBe(6601.98);
  });
});
