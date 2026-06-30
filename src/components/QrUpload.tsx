import { useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import { recipientName, validateQrPh } from '../core';
import { decodeQrImage } from '../lib/decodeQrImage';

/** Upload a QR image, decode + validate it as a QR Ph payload, and report the
 *  payload back (or null to clear). Pure shell — all parsing lives in the core. */
export function QrUpload({
  qrPh,
  onSet,
  label,
}: {
  qrPh?: string;
  onSet: (qrPh: string | null) => void;
  label?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = ''; // let the same file be re-picked later
    if (!file) return;
    setError(null);
    setBusy(true);
    try {
      const text = await decodeQrImage(file);
      if (!text) {
        setError('No QR code found in that image.');
        return;
      }
      const firstError = validateQrPh(text).find((issue) => issue.severity === 'error');
      if (firstError) {
        setError(firstError.message);
        return;
      }
      onSet(text);
    } catch {
      setError('Could not read that image.');
    } finally {
      setBusy(false);
    }
  }

  const name = qrPh ? recipientName(qrPh) : undefined;

  return (
    <div className="bucket-qr">
      <input ref={inputRef} type="file" accept="image/*" hidden onChange={onFile} />
      {qrPh ? (
        <div className="flex items-center gap-3">
          <span className="qr-tag">QR linked{name ? ` · ${name}` : ''}</span>
          <button type="button" className="btn-add ml-auto" onClick={() => inputRef.current?.click()}>
            Replace
          </button>
          <button
            type="button"
            className="btn-add"
            style={{ color: 'var(--danger)' }}
            onClick={() => onSet(null)}
          >
            Remove
          </button>
        </div>
      ) : (
        <button
          type="button"
          className="btn-add"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
        >
          {busy ? 'Reading…' : `+ Upload ${label ?? 'payment'} QR`}
        </button>
      )}
      {error ? <p className="text-danger mt-1 text-xs">{error}</p> : null}
    </div>
  );
}
