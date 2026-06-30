import type { ValidationIssue } from '../types';
import { parseEmv } from './parseEmv';
import { computeCrc16 } from './computeCrc16';

const TAG_CURRENCY = '53';
const TAG_COUNTRY = '58';
const PHP = '608';
const PH = 'PH';

/**
 * Check that a pasted/decoded payload is a usable PHP QR Ph: the CRC matches,
 * the currency is PHP (608) and the country is PH. Never throws — problems come
 * back as issues, matching the core's ValidationIssue shape.
 */
export function validateQrPh(payload: string): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  if (payload.length < 8) {
    issues.push({ severity: 'error', code: 'qr_too_short', message: 'This is not a valid QR Ph code.' });
    return issues;
  }

  const body = payload.slice(0, -4);
  const storedCrc = payload.slice(-4).toUpperCase();
  if (computeCrc16(body) !== storedCrc) {
    issues.push({
      severity: 'error',
      code: 'qr_bad_crc',
      message: 'QR checksum does not match — the code may be incomplete or corrupted.',
    });
  }

  const fields = parseEmv(payload);
  const valueOf = (tag: string) => fields.find((field) => field.tag === tag)?.value;

  if (valueOf(TAG_CURRENCY) !== PHP) {
    issues.push({ severity: 'error', code: 'qr_not_php', message: 'This QR is not in Philippine Pesos.' });
  }
  if (valueOf(TAG_COUNTRY) !== PH) {
    issues.push({ severity: 'error', code: 'qr_not_ph', message: 'This QR is not a Philippine QR Ph code.' });
  }

  return issues;
}
