import { describe, it, expect } from 'vitest';
import { parseEmv } from './parseEmv';
import { computeCrc16 } from './computeCrc16';
import { injectAmount } from './injectAmount';
import { validateQrPh } from './validateQrPh';

// Synthetic QR Ph fixtures — no real accounts. Built to the EMVCo TLV shape and
// signed with our own computeCrc16, so they exercise the full parse/validate path.
const tlv = (tag: string, value: string) =>
  tag + value.length.toString().padStart(2, '0') + value;

function staticQrPh(opts: { proxy: string; account: string; name: string; city: string }): string {
  const merchant =
    tlv('00', 'com.p2pqrpay') + tlv('01', opts.proxy) + tlv('02', opts.account);
  const body =
    tlv('00', '01') +
    tlv('01', '11') +
    tlv('27', merchant) +
    tlv('53', '608') +
    tlv('58', 'PH') +
    tlv('59', opts.name) +
    tlv('60', opts.city) +
    '6304';
  return body + computeCrc16(body);
}

const PROVIDERS = {
  gotyme: staticQrPh({
    proxy: 'TESTPHM1XXX',
    account: '1234567890',
    name: 'JUAN DELA CRUZ',
    city: 'Manila',
  }),
  maya: staticQrPh({
    proxy: 'TESTPHM2XXX',
    account: '0987654321',
    name: 'JUANA REYES',
    city: 'Cebu',
  }),
} as const;

const valueOf = (payload: string, tag: string) =>
  parseEmv(payload).find((field) => field.tag === tag)?.value;

describe('computeCrc16 — CRC-16/CCITT-FALSE', () => {
  it('matches the canonical check value for "123456789"', () => {
    expect(computeCrc16('123456789')).toBe('29B1');
  });

  it('signs a payload such that it re-validates', () => {
    expect(computeCrc16(PROVIDERS.gotyme.slice(0, -4))).toBe(PROVIDERS.gotyme.slice(-4));
  });
});

describe('parseEmv — top-level fields and nested templates', () => {
  it('reads the standard top-level tags', () => {
    expect(valueOf(PROVIDERS.gotyme, '00')).toBe('01');
    expect(valueOf(PROVIDERS.gotyme, '53')).toBe('608');
    expect(valueOf(PROVIDERS.gotyme, '58')).toBe('PH');
    expect(valueOf(PROVIDERS.gotyme, '59')).toBe('JUAN DELA CRUZ');
  });

  it('parses the merchant-account template (27) into subfields', () => {
    const merchant = parseEmv(PROVIDERS.gotyme).find((field) => field.tag === '27');
    expect(merchant?.subfields?.find((sub) => sub.tag === '00')?.value).toBe('com.p2pqrpay');
    expect(merchant?.subfields?.find((sub) => sub.tag === '01')?.value).toBe('TESTPHM1XXX');
  });
});

describe('injectAmount — static to dynamic with amount', () => {
  for (const [name, payload] of Object.entries(PROVIDERS)) {
    it(`sets init=12 and amount, with a valid CRC, for ${name}`, () => {
      const dynamic = injectAmount(payload, { amountCentavos: 44013 });
      expect(valueOf(dynamic, '01')).toBe('12');
      expect(valueOf(dynamic, '54')).toBe('440.13');
      expect(validateQrPh(dynamic)).toEqual([]);
    });
  }

  it('formats whole-peso amounts with two decimals', () => {
    const dynamic = injectAmount(PROVIDERS.gotyme, { amountCentavos: 500000 });
    expect(valueOf(dynamic, '54')).toBe('5000.00');
    expect(validateQrPh(dynamic)).toEqual([]);
  });

  it('adds a reference into the additional-data template (62)', () => {
    const dynamic = injectAmount(PROVIDERS.gotyme, { amountCentavos: 500000, reference: 'RENT' });
    const additional = parseEmv(dynamic).find((field) => field.tag === '62');
    expect(additional?.subfields?.find((sub) => sub.tag === '05')?.value).toBe('RENT');
    expect(validateQrPh(dynamic)).toEqual([]);
  });
});

describe('validateQrPh — accepts well-formed codes, flags bad ones', () => {
  for (const [name, payload] of Object.entries(PROVIDERS)) {
    it(`accepts ${name}`, () => {
      expect(validateQrPh(payload)).toEqual([]);
    });
  }

  it('flags a tampered checksum', () => {
    const tampered = PROVIDERS.gotyme.slice(0, -1) + (PROVIDERS.gotyme.endsWith('E') ? 'F' : 'E');
    expect(validateQrPh(tampered).some((issue) => issue.code === 'qr_bad_crc')).toBe(true);
  });

  it('rejects an obviously non-QR string', () => {
    expect(validateQrPh('hello').some((issue) => issue.code === 'qr_too_short')).toBe(true);
  });
});
