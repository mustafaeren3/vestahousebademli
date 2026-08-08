"use client";

// Client-side photo optimization: runs in the browser before a file ever
// reaches the server action / Supabase Storage. Downscales to a sane max
// dimension, fixes EXIF orientation (common on iPhone photos), and
// re-encodes to WebP so uploads stay small without a visible quality hit.

const MAX_DIMENSION = 2400;
const WEBP_QUALITY = 0.82;
const MIN_QUALITY = 0.5;
const QUALITY_STEP = 0.08;
const TARGET_MAX_BYTES = 1.5 * 1024 * 1024;
const SOURCE_MAX_BYTES = 25 * 1024 * 1024;
const HEIC_CONVERT_TIMEOUT_MS = 20000;

export class PhotoOptimizeError extends Error {}

function isHeic(file) {
  const name = (file.name || "").toLowerCase();
  return (
    file.type === "image/heic" ||
    file.type === "image/heif" ||
    name.endsWith(".heic") ||
    name.endsWith(".heif")
  );
}

function canvasToBlob(canvas, type, quality) {
  return new Promise((resolve) => canvas.toBlob(resolve, type, quality));
}

const HEIC_UNSUPPORTED_MESSAGE =
  "HEIC/HEIF formatındaki bu fotoğraf tarayıcıda dönüştürülemedi. Lütfen iPhone'da fotoğrafı JPEG olarak paylaşıp tekrar yükleyin.";

function withTimeout(promise, ms) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("timeout")), ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (err) => {
        clearTimeout(timer);
        reject(err);
      }
    );
  });
}

async function convertHeic(file) {
  try {
    const { default: heic2any } = await import("heic2any");
    let result = await withTimeout(
      heic2any({ blob: file, toType: "image/jpeg", quality: 0.9 }),
      HEIC_CONVERT_TIMEOUT_MS
    );
    if (Array.isArray(result)) result = result[0];
    return result;
  } catch (err) {
    throw new PhotoOptimizeError(HEIC_UNSUPPORTED_MESSAGE);
  }
}

// Optimizes a single photo File: HEIC/HEIF -> JPEG, EXIF-orientation-safe
// downscale to <=2400px on the long edge, then WebP re-encode targeting
// ~300 KB-1.5 MB. Throws PhotoOptimizeError with a Turkish message on failure.
export async function optimizePhoto(file) {
  if (!file || typeof file === "string") {
    throw new PhotoOptimizeError("Görsel bulunamadı.");
  }
  if (file.size > SOURCE_MAX_BYTES) {
    throw new PhotoOptimizeError("Görsel çok büyük. Lütfen 25 MB'dan küçük bir fotoğraf seçin.");
  }

  const sourceBlob = isHeic(file) ? await convertHeic(file) : file;

  let bitmap;
  try {
    bitmap = await createImageBitmap(sourceBlob, { imageOrientation: "from-image" });
  } catch (err) {
    throw new PhotoOptimizeError("Görsel okunamadı. Lütfen geçerli bir fotoğraf dosyası seçin.");
  }

  const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close?.();

  let quality = WEBP_QUALITY;
  let blob = await canvasToBlob(canvas, "image/webp", quality);

  if (!blob || blob.type !== "image/webp") {
    // Browser can't encode WebP; fall back to JPEG rather than failing outright.
    blob = await canvasToBlob(canvas, "image/jpeg", quality);
  }

  if (!blob) {
    throw new PhotoOptimizeError("Görsel optimize edilemedi. Lütfen farklı bir fotoğraf deneyin.");
  }

  while (blob.size > TARGET_MAX_BYTES && quality > MIN_QUALITY) {
    quality = Math.max(MIN_QUALITY, quality - QUALITY_STEP);
    const smaller = await canvasToBlob(canvas, blob.type, quality);
    if (!smaller) break;
    blob = smaller;
  }

  const ext = blob.type === "image/webp" ? "webp" : "jpg";
  const baseName = (file.name || "photo").replace(/\.[^.]+$/, "");
  return new File([blob], `${baseName}.${ext}`, { type: blob.type });
}
