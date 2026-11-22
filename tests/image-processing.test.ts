import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { MAX_IMAGE_PIXELS, compressImage, validateImageDimensions } from "../lib/image-processing";

test("image compressor enforces the inclusive 40-megapixel input resolution limit", () => {
  assert.equal(MAX_IMAGE_PIXELS, 40_000_000);
  assert.doesNotThrow(() => validateImageDimensions(8000, 5000));
  assert.throws(() => validateImageDimensions(8000, 5001), /exceeds the 40-megapixel limit.*40 megapixels or fewer/);
  assert.throws(() => validateImageDimensions(0, 5000), /invalid dimensions/);
});

test("image compressor discloses both input limits beside the upload control", () => {
  const source = readFileSync("components/tools/image-compressor.tsx", "utf8");
  const uploadPosition = source.indexOf('<input id="image-file"');
  const limitsPosition = source.indexOf("Maximum input file size: 20 MB; maximum input resolution: 40 megapixels.", uploadPosition);
  assert.ok(uploadPosition >= 0 && limitsPosition > uploadPosition && limitsPosition - uploadPosition < 300,
    "both limits should be disclosed next to the file picker");
  assert.match(source, /<input id="image-file"[^>]*aria-describedby="image-file-hint"/u);
  assert.match(source, /<p id="image-file-hint"[^>]*>JPEG, PNG, or WebP/u);
});

test("image compressor locks submitted settings and binds the download to the encoded output", () => {
  const source = readFileSync("components/tools/image-compressor.tsx", "utf8");
  assert.match(source, /<SelectField id="image-format"[^>]*disabled=\{busy\}/u);
  assert.match(source, /<SelectField id="image-dimensions"[^>]*disabled=\{busy\}/u);
  assert.match(source, /disabled=\{busy \|\| format === "image\/png"\}/u);
  assert.match(source, /if \(mounted\.current\) \{\s*setOutput\(\{ \.\.\.compressed, url:/u);
  assert.match(source, /output\.outputType\.split\("\/"\)\[1\]/u);
  assert.match(source, /output\.width\}[^\n]*output\.height/u);
});

test("compression rejects a decoded image above 40 megapixels before canvas processing", async () => {
  const oldCreateImageBitmap = Object.getOwnPropertyDescriptor(globalThis, "createImageBitmap");
  let closeCount = 0;
  Object.defineProperty(globalThis, "createImageBitmap", {
    configurable: true,
    value: async () => ({ width: 8000, height: 5001, close: () => { closeCount += 1; } }),
  });

  try {
    await assert.rejects(
      compressImage({ type: "image/png", size: 1024 } as File, { format: "image/png", quality: 0.8, maxDimension: 2000 }),
      /exceeds the 40-megapixel limit.*40 megapixels or fewer/,
    );
    assert.equal(closeCount, 1);
  } finally {
    if (oldCreateImageBitmap) Object.defineProperty(globalThis, "createImageBitmap", oldCreateImageBitmap);
    else Reflect.deleteProperty(globalThis, "createImageBitmap");
  }
});

test("image compressor resizes and encodes locally, and reports unsupported browser formats", async () => {
  const oldDocument = Object.getOwnPropertyDescriptor(globalThis, "document");
  const oldCreateImageBitmap = Object.getOwnPropertyDescriptor(globalThis, "createImageBitmap");
  let closeCount = 0;
  let outputType = "image/jpeg";
  let requestedType = "";
  let requestedQuality = 0;
  let drawDimensions: number[] = [];
  let fillCount = 0;
  const context = {
    fillStyle: "",
    fillRect: () => { fillCount += 1; },
    drawImage: (...args: number[]) => { drawDimensions = args.slice(-4); },
  } as unknown as CanvasRenderingContext2D;
  const canvas = {
    width: 0,
    height: 0,
    getContext: () => context,
    toBlob: (callback: BlobCallback, type?: string, quality?: number) => {
      requestedType = type ?? "";
      requestedQuality = quality ?? 0;
      callback(new Blob(["compressed"], { type: outputType }));
    },
  } as unknown as HTMLCanvasElement;
  Object.defineProperty(globalThis, "document", { configurable: true, value: { createElement: () => canvas } });
  Object.defineProperty(globalThis, "createImageBitmap", {
    configurable: true,
    value: async () => ({ width: 4000, height: 2000, close: () => { closeCount += 1; } }),
  });

  try {
    const file = { type: "image/jpeg", size: 4096 } as File;
    const result = await compressImage(file, { format: "image/jpeg", quality: 0.75, maxDimension: 2000 });
    assert.deepEqual([result.width, result.height], [2000, 1000]);
    assert.equal(result.blob.type, "image/jpeg");
    assert.equal(result.outputType, result.blob.type);
    assert.equal(result.outputBytes, 10);
    assert.equal(result.originalBytes, 4096);
    assert.equal(requestedType, "image/jpeg");
    assert.equal(requestedQuality, 0.75);
    assert.deepEqual(drawDimensions, [0, 0, 2000, 1000]);
    assert.equal(fillCount, 1);
    assert.equal(canvas.width, 0);
    assert.equal(canvas.height, 0);
    assert.equal(closeCount, 1);

    await assert.rejects(compressImage(file, { format: "image/jpeg", quality: 0, maxDimension: 2000 }), /quality must be between/);
    await assert.rejects(compressImage(file, { format: "image/jpeg", quality: 0.8, maxDimension: 128 }), /dimension must be between/);

    outputType = "image/png";
    await assert.rejects(
      compressImage(file, { format: "image/webp", quality: 0.8, maxDimension: 2000 }),
      /WEBP output is not supported/,
    );
    assert.equal(closeCount, 2);
  } finally {
    if (oldDocument) Object.defineProperty(globalThis, "document", oldDocument);
    else Reflect.deleteProperty(globalThis, "document");
    if (oldCreateImageBitmap) Object.defineProperty(globalThis, "createImageBitmap", oldCreateImageBitmap);
    else Reflect.deleteProperty(globalThis, "createImageBitmap");
  }
});
