import jsQR from 'jsqr';

/** Draw an image bitmap to an offscreen canvas and read back its pixels. */
function toImageData(bitmap: ImageBitmap): ImageData {
  const canvas = document.createElement('canvas');
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context unavailable');
  ctx.drawImage(bitmap, 0, 0);
  return ctx.getImageData(0, 0, canvas.width, canvas.height);
}

/**
 * Decode a QR image file to its raw text payload, or null if none is found.
 * Browser-only (uses canvas + jsQR) — part of the imperative shell, not the core.
 */
export async function decodeQrImage(file: File): Promise<string | null> {
  const bitmap = await createImageBitmap(file);
  try {
    const { data, width, height } = toImageData(bitmap);
    return jsQR(data, width, height)?.data ?? null;
  } finally {
    bitmap.close();
  }
}
