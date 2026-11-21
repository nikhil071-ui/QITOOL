export type QrCodeResult = Readonly<{
  content: string;
  pngDataUrl: string;
}>;

export function createQrCodeResult(content: string, pngDataUrl: string): QrCodeResult {
  return Object.freeze({ content, pngDataUrl });
}

export function getQrCodeResultActions(result: QrCodeResult) {
  return {
    copyText: result.content,
    previewUrl: result.pngDataUrl,
    downloadUrl: result.pngDataUrl,
  };
}
