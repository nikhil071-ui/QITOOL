import assert from "node:assert/strict";
import test from "node:test";
import { compressImage } from "../lib/image-processing";

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
