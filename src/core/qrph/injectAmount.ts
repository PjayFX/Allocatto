import type { EmvField } from './types';
import { parseEmv } from './parseEmv';
import { renderFields } from './renderEmv';
import { computeCrc16 } from './computeCrc16';

const TAG_INIT = '01'; // point of initiation method
const TAG_CURRENCY = '53';
const TAG_AMOUNT = '54';
const TAG_ADDITIONAL = '62';
const TAG_CRC = '63';
const REFERENCE_SUBTAG = '05';
const DYNAMIC = '12'; // one-time / dynamic

export interface InjectOptions {
  amountCentavos: number;
  reference?: string;
}

/** Centavos -> major units with 2 decimals, e.g. 44013 -> "440.13". */
function majorUnits(centavos: number): string {
  return (centavos / 100).toFixed(2);
}

/** Drop any existing amount, then place it directly after the currency tag so the
 *  original field order is preserved. */
function withAmountAfterCurrency(fields: EmvField[], amount: string): EmvField[] {
  const result: EmvField[] = [];
  for (const field of fields) {
    if (field.tag === TAG_AMOUNT) continue;
    result.push(field);
    if (field.tag === TAG_CURRENCY) result.push({ tag: TAG_AMOUNT, value: amount });
  }
  return result;
}

/** Set the additional-data (62) reference subfield (05), creating tag 62 if absent. */
function withReference(fields: EmvField[], reference: string): EmvField[] {
  const refSub: EmvField = { tag: REFERENCE_SUBTAG, value: reference };
  const index = fields.findIndex((field) => field.tag === TAG_ADDITIONAL);
  if (index === -1) {
    return [...fields, { tag: TAG_ADDITIONAL, value: renderFields([refSub]) }];
  }
  const subfields = parseEmv(fields[index]!.value);
  const next = subfields.some((sub) => sub.tag === REFERENCE_SUBTAG)
    ? subfields.map((sub) => (sub.tag === REFERENCE_SUBTAG ? refSub : sub))
    : [...subfields, refSub];
  return fields.map((field, i) =>
    i === index ? { tag: TAG_ADDITIONAL, value: renderFields(next) } : field,
  );
}

/**
 * Turn a static QR Ph payload into a dynamic one with a pre-filled amount: flip
 * the initiation method to one-time, insert the transaction amount after the
 * currency tag, optionally set a reference, then re-append a fresh CRC. Only
 * top-level tags are touched; nested template content is left byte-for-byte.
 */
export function injectAmount(basePayload: string, opts: InjectOptions): string {
  let fields = parseEmv(basePayload)
    .filter((field) => field.tag !== TAG_CRC)
    .map((field) => (field.tag === TAG_INIT ? { ...field, value: DYNAMIC } : field));

  fields = withAmountAfterCurrency(fields, majorUnits(opts.amountCentavos));
  if (opts.reference) fields = withReference(fields, opts.reference);

  const body = renderFields(fields) + TAG_CRC + '04';
  return body + computeCrc16(body);
}
