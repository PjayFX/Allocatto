import type { EmvField } from './types';

/** Emit one field as tag + 2-digit length + value. Length is the value's
 *  character count (QR Ph payloads are ASCII, so chars == bytes). */
export function renderField(tag: string, value: string): string {
  return tag + String(value.length).padStart(2, '0') + value;
}

/** Emit a sequence of fields back to a TLV string, in order. */
export function renderFields(fields: EmvField[]): string {
  return fields.map((field) => renderField(field.tag, field.value)).join('');
}
