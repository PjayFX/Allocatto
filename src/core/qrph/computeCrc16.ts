/**
 * CRC-16/CCITT-FALSE over an ASCII string: poly 0x1021, init 0xFFFF, no reflect,
 * xorout 0x0000. Returned as 4 uppercase hex chars. For QR Ph this is computed
 * over the whole payload up to and including the trailing "6304", then appended
 * as tag 63's value.
 */
export function computeCrc16(data: string): string {
  let crc = 0xffff;
  for (let i = 0; i < data.length; i++) {
    crc ^= data.charCodeAt(i) << 8;
    for (let bit = 0; bit < 8; bit++) {
      crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1;
      crc &= 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}
