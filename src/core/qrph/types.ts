// types — EMV TLV shapes for QR Ph payloads

/**
 * One EMV field: a 2-digit `tag`, then a 2-digit length, then `value`. Template
 * tags (additional-data `62`, language `64`, and merchant-account `26`–`51`)
 * carry nested fields; `subfields` holds those parsed for reading. The raw
 * `value` is always preserved verbatim so re-emitting stays byte-identical.
 */
export interface EmvField {
  tag: string;
  value: string;
  subfields?: EmvField[];
}
