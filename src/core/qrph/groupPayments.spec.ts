import { describe, it, expect } from 'vitest';
import { computeCrc16 } from './computeCrc16';
import { groupPayments, recipientName } from './groupPayments';

// Synthetic fixtures — no real accounts. Signed with our own computeCrc16.
const tlv = (tag: string, value: string) =>
  tag + value.length.toString().padStart(2, '0') + value;

function staticQrPh(opts: { proxy: string; name: string }): string {
  const merchant = tlv('00', 'com.p2pqrpay') + tlv('01', opts.proxy) + tlv('02', '1234567890');
  const body =
    tlv('00', '01') +
    tlv('01', '11') +
    tlv('27', merchant) +
    tlv('53', '608') +
    tlv('58', 'PH') +
    tlv('59', opts.name) +
    tlv('60', 'Manila') +
    '6304';
  return body + computeCrc16(body);
}

const GOTYME = staticQrPh({ proxy: 'TESTPHM1XXX', name: 'JUAN DELA CRUZ' });
const MARIBANK = staticQrPh({ proxy: 'TESTPHM2XXX', name: 'JUANA REYES' });

describe('groupPayments — merges categories that share a QR', () => {
  it('sums amounts for the same destination and lists its categories', () => {
    const groups = groupPayments([
      { label: 'Savings', amountCentavos: 500000, qrPh: GOTYME },
      { label: 'Wants', amountCentavos: 150000, qrPh: GOTYME },
      { label: 'Allowance', amountCentavos: 660198, qrPh: MARIBANK },
    ]);

    expect(groups).toHaveLength(2);
    expect(groups[0]).toMatchObject({
      qrPh: GOTYME,
      amountCentavos: 650000,
      labels: ['Savings', 'Wants'],
      recipientName: 'JUAN DELA CRUZ',
    });
    expect(groups[1]).toMatchObject({
      qrPh: MARIBANK,
      amountCentavos: 660198,
      labels: ['Allowance'],
    });
  });

  it('keeps distinct destinations separate', () => {
    const groups = groupPayments([
      { label: 'Savings', amountCentavos: 1, qrPh: GOTYME },
      { label: 'Allowance', amountCentavos: 2, qrPh: MARIBANK },
    ]);
    expect(groups.map((g) => g.amountCentavos)).toEqual([1, 2]);
  });
});

describe('recipientName', () => {
  it('reads the merchant name (tag 59)', () => {
    expect(recipientName(GOTYME)).toBe('JUAN DELA CRUZ');
    expect(recipientName(MARIBANK)).toBe('JUANA REYES');
  });
});
