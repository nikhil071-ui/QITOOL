import assert from "node:assert/strict";
import test from "node:test";
import QRCode from "qrcode";
import { MAX_IMAGE_BYTES, validateImageFile, validateQrContent } from "../lib/calculations";

test("QR validation trims content and the local library creates a QR matrix", () => {
  const content = validateQrContent("  https://qitool.example/tools  ");
  assert.equal(content, "https://qitool.example/tools");
  const matrix = QRCode.create(content, { errorCorrectionLevel: "M" });
  assert.ok(matrix.modules.size > 0);
  assert.ok(QRCode.create("こんにちは").modules.size > 0);
});

test("QR validation rejects blank and oversized content", () => {
  assert.throws(() => validateQrContent("  "), /Enter a web address/);
  assert.throws(() => validateQrContent("x".repeat(2001)), /2,000 characters/);
  assert.equal(validateQrContent("x".repeat(2000)).length, 2000);
});

test("image compressor accepts supported formats and rejects unsafe files", () => {
  for (const type of ["image/jpeg", "image/png", "image/webp"]) {
    assert.doesNotThrow(() => validateImageFile({ type, size: 1024 }));
  }
  assert.doesNotThrow(() => validateImageFile({ type: "image/jpeg", size: MAX_IMAGE_BYTES }));
  assert.throws(() => validateImageFile({ type: "image/gif", size: 1024 }), /JPEG, PNG, or WebP/);
  assert.throws(() => validateImageFile({ type: "image/png", size: MAX_IMAGE_BYTES + 1 }), /File size/);
  assert.throws(() => validateImageFile({ type: "image/jpeg", size: 0 }), /File size/);
});
