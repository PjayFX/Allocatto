// qrph — QR Ph (EMVCo) parsing, CRC, and dynamic-amount injection (no deps)
export { parseEmv } from './parseEmv';
export { computeCrc16 } from './computeCrc16';
export { injectAmount } from './injectAmount';
export type { InjectOptions } from './injectAmount';
export { validateQrPh } from './validateQrPh';
export { groupPayments, recipientName } from './groupPayments';
export type { PaymentItem, PaymentGroup } from './groupPayments';
export type { EmvField } from './types';
