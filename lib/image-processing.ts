import { MAX_IMAGE_BYTES, validateImageFile } from "./calculations";

export type ImageOutputFormat = "image/jpeg" | "image/png" | "image/webp";
export type ImageCompressionOptions = { format: ImageOutputFormat; quality: number; maxDimension: number };
export type ImageCompressionResult = {
  blob: Blob;
  width: number;
  height: number;
  originalBytes: number;
  outputBytes: number;
  outputType: ImageOutputFormat;
};

const MAX_PIXELS = 40_000_000;

type DecodedImage = {
  source: CanvasImageSource;
  width: number;
  height: number;
  close: () => void;
};

async function decodeImage(file: File): Promise<DecodedImage> {
  if (typeof createImageBitmap === "function") {
    const bitmap = await createImageBitmap(file);
    return { source: bitmap, width: bitmap.width, height: bitmap.height, close: () => bitmap.close() };
  }

  const objectUrl = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.decoding = "async";
    image.src = objectUrl;
    await image.decode();
    return {
      source: image,
      width: image.naturalWidth,
      height: image.naturalHeight,
      close: () => URL.revokeObjectURL(objectUrl),
    };
  } catch (error) {
    URL.revokeObjectURL(objectUrl);
    throw error;
  }
}

function canvasToBlob(canvas: HTMLCanvasElement, format: ImageOutputFormat, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("Your browser could not encode this image. Try a smaller image or another format."));
      } else if (blob.type !== format) {
        reject(new Error(`${format.replace("image/", "").toUpperCase()} output is not supported by this browser. Choose JPEG or PNG instead.`));
      } else {
        resolve(blob);
      }
    }, format, quality);
  });
}

export async function compressImage(file: File, options: ImageCompressionOptions): Promise<ImageCompressionResult> {
  validateImageFile(file, MAX_IMAGE_BYTES);
  if (!Number.isFinite(options.quality) || options.quality < 0.1 || options.quality > 1) {
    throw new Error("Image quality must be between 10% and 100%.");
  }
  if (!Number.isInteger(options.maxDimension) || options.maxDimension < 256 || options.maxDimension > 6000) {
    throw new Error("Maximum image dimension must be between 256 and 6,000 pixels.");
  }

  let decoded: DecodedImage;
  try {
    decoded = await decodeImage(file);
  } catch {
    throw new Error("This file could not be decoded as an image. Choose a valid JPEG, PNG, or WebP file.");
  }

  try {
    if (decoded.width < 1 || decoded.height < 1) throw new Error("The image has invalid dimensions.");
    if (decoded.width * decoded.height > MAX_PIXELS) throw new Error("This image has too many pixels to process safely. Choose an image under 40 megapixels.");

    const scale = Math.min(1, options.maxDimension / Math.max(decoded.width, decoded.height));
    const width = Math.max(1, Math.round(decoded.width * scale));
    const height = Math.max(1, Math.round(decoded.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d", { alpha: options.format !== "image/jpeg" });
    if (!context) throw new Error("Canvas image processing is unavailable in this browser.");

    if (options.format === "image/jpeg") {
      context.fillStyle = "#fff";
      context.fillRect(0, 0, width, height);
    }
    context.drawImage(decoded.source, 0, 0, width, height);
    const blob = await canvasToBlob(canvas, options.format, options.quality);
    canvas.width = 0;
    canvas.height = 0;
    return {
      blob,
      width,
      height,
      originalBytes: file.size,
      outputBytes: blob.size,
      outputType: options.format,
    };
  } finally {
    decoded.close();
  }
}
