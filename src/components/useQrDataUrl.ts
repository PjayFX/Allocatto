import { useEffect, useState } from 'react';
import QRCode from 'qrcode';

const LOGO_SRC = '/Allocatto.png';

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function roundRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
): void {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/** Render the QR (high error-correction so the centre logo is tolerated) and
 *  composite the cat logo on a white rounded tile in the middle. */
async function renderQrWithLogo(payload: string, size: number): Promise<string> {
  const pixels = size * 2;
  const canvas = document.createElement('canvas');
  await QRCode.toCanvas(canvas, payload, { width: pixels, margin: 1, errorCorrectionLevel: 'H' });

  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas.toDataURL('image/png');

  const logo = await loadImage(LOGO_SRC).catch(() => null);
  if (logo) {
    const box = pixels * 0.3;
    const x = (pixels - box) / 2;
    const y = (pixels - box) / 2;
    ctx.fillStyle = '#ffffff';
    roundRectPath(ctx, x, y, box, box, box * 0.22);
    ctx.fill();
    const pad = box * 0.12;
    ctx.drawImage(logo, x + pad, y + pad, box - pad * 2, box - pad * 2);
  }

  return canvas.toDataURL('image/png');
}

/** QR payload -> PNG data-URL with the centre logo. Returns null until ready.
 *  Used for both the on-screen <img> and the download link. */
export function useQrDataUrl(payload: string, size = 240): string | null {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    renderQrWithLogo(payload, size)
      .then((url) => active && setSrc(url))
      .catch(() => active && setSrc(null));
    return () => {
      active = false;
    };
  }, [payload, size]);

  return src;
}
