const MAX_LONG_EDGE = 1280;
const JPEG_QUALITY = 0.75;
export const MAX_UPLOAD_BYTES = 2 * 1024 * 1024; // mirrors lmnt-be's maxUploadBytes

export class ImageTooLargeError extends Error {
  constructor() {
    super(`Photo is still over ${MAX_UPLOAD_BYTES / 1024 / 1024}MB after compression — try a different photo.`);
  }
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Could not read that image file.'));
    img.src = URL.createObjectURL(file);
  });
}

function canvasToBlob(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Compression failed.'))),
      'image/jpeg',
      quality,
    );
  });
}

export interface ScaledDimensions {
  width: number;
  height: number;
}

/** Pure dimension math, split out from compressImage so it's testable without a real <canvas>. */
export function computeScaledDimensions(
  sourceWidth: number,
  sourceHeight: number,
  maxLongEdge = MAX_LONG_EDGE,
): ScaledDimensions {
  const scale = Math.min(1, maxLongEdge / Math.max(sourceWidth, sourceHeight));
  return {
    width: Math.round(sourceWidth * scale),
    height: Math.round(sourceHeight * scale),
  };
}

/**
 * Resizes to a capped long-edge dimension and re-encodes as JPEG, matching
 * lmnt-be's server-side backstop (design.md §5) so the client-side cap and
 * the backend's cap agree on the same number.
 */
export async function compressImage(file: File): Promise<Blob> {
  const img = await loadImage(file);
  try {
    const { width, height } = computeScaledDimensions(img.width, img.height);

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas not supported.');
    ctx.drawImage(img, 0, 0, width, height);

    const blob = await canvasToBlob(canvas, JPEG_QUALITY);
    if (blob.size > MAX_UPLOAD_BYTES) {
      throw new ImageTooLargeError();
    }
    return blob;
  } finally {
    URL.revokeObjectURL(img.src);
  }
}
