import assert from "node:assert/strict";
import test from "node:test";
import QRCode from "qrcode";
import { createQrCodeResult, getQrCodeResultActions } from "../lib/qr-result";

const qrOptions = { width: 512, margin: 4, errorCorrectionLevel: "M" as const };
const urlA = "https://example.org/a";
const urlB = "https://example.org/b";

test("QR result actions stay bound to the URL submitted for each generated PNG", async () => {
  const pngA = await QRCode.toDataURL(urlA, qrOptions);
  const resultA = createQrCodeResult(urlA, pngA);

  const currentInput = urlB;
  const actionsA = getQrCodeResultActions(resultA);
  assert.equal(currentInput, urlB);
  assert.ok(Object.isFrozen(resultA));
  assert.equal(resultA.content, urlA);
  assert.equal(actionsA.copyText, urlA);
  assert.equal(actionsA.previewUrl, pngA);
  assert.equal(actionsA.downloadUrl, pngA);

  const pngB = await QRCode.toDataURL(currentInput, qrOptions);
  const resultB = createQrCodeResult(currentInput, pngB);
  const actionsB = getQrCodeResultActions(resultB);
  assert.equal(resultB.content, urlB);
  assert.equal(actionsB.copyText, urlB);
  assert.equal(actionsB.previewUrl, pngB);
  assert.equal(actionsB.downloadUrl, pngB);
  assert.notEqual(pngA, pngB);
});
