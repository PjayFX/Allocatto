import type { EmvField } from './types';

/** Template tags whose value is itself a sequence of EMV fields. */
function isTemplateTag(tag: string): boolean {
  const n = Number(tag);
  return (n >= 26 && n <= 51) || n === 62 || n === 64;
}

/** Split one TLV string into its top-level fields, in order. Tolerant: stops at
 *  the first malformed/short remainder instead of throwing. */
function splitFields(tlv: string): EmvField[] {
  const fields: EmvField[] = [];
  let i = 0;
  while (i + 4 <= tlv.length) {
    const tag = tlv.slice(i, i + 2);
    const length = Number(tlv.slice(i + 2, i + 4));
    const start = i + 4;
    if (!Number.isFinite(length) || start + length > tlv.length) break;
    fields.push({ tag, value: tlv.slice(start, start + length) });
    i = start + length;
  }
  return fields;
}

/**
 * Parse a QR Ph (EMVCo) payload into top-level fields, preserving order. Template
 * fields also get their `subfields` parsed for reading; their raw `value` is left
 * intact so callers can re-emit untouched fields byte-for-byte.
 */
export function parseEmv(payload: string): EmvField[] {
  return splitFields(payload).map((field) =>
    isTemplateTag(field.tag) ? { ...field, subfields: splitFields(field.value) } : field,
  );
}
