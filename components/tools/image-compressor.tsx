"use client";

import { useEffect, useState, type FormEvent, type ChangeEvent } from "react";
import Image from "next/image";
import { Download, Image as ImageIcon } from "lucide-react";
import { compressImage, type ImageOutputFormat } from "@/lib/image-processing";
import { validateImageFile } from "@/lib/calculations";
import { ErrorNotice, SelectField, ToolActions } from "@/components/tools/form-elements";

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KB", "MB", "GB"];
  let value = bytes / 1024;
  let index = 0;
  while (value >= 1024 && index < units.length - 1) {
    value /= 1024;
    index += 1;
  }
  return `${value.toFixed(1)} ${units[index]}`;
}

export function ImageCompressor() {
  const [file, setFile] = useState<File | null>(null);
  const [inputUrl, setInputUrl] = useState("");
  const [outputUrl, setOutputUrl] = useState("");
  const [outputBlob, setOutputBlob] = useState<Blob | null>(null);
  const [format, setFormat] = useState<ImageOutputFormat>("image/jpeg");
  const [quality, setQuality] = useState(80);
  const [maxDimension, setMaxDimension] = useState("2000");
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => () => {
    if (inputUrl) URL.revokeObjectURL(inputUrl);
  }, [inputUrl]);

  useEffect(() => () => {
    if (outputUrl) URL.revokeObjectURL(outputUrl);
  }, [outputUrl]);

  const clearResult = () => {
    setOutputUrl("");
    setOutputBlob(null);
    setDimensions(null);
  };

  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextFile = event.currentTarget.files?.[0];
    if (!nextFile) return;
    clearResult();
    try {
      validateImageFile(nextFile);
      setError("");
      setFile(nextFile);
      setInputUrl(URL.createObjectURL(nextFile));
      setFormat(nextFile.type as ImageOutputFormat);
    } catch (cause) {
      setFile(null);
      setInputUrl("");
      setError(cause instanceof Error ? cause.message : "Choose a valid image file.");
    }
  };

  const reset = () => {
    setFile(null);
    setInputUrl("");
    clearResult();
    setFormat("image/jpeg");
    setQuality(80);
    setMaxDimension("2000");
    setError("");
    setBusy(false);
    const input = document.getElementById("image-file") as HTMLInputElement | null;
    if (input) input.value = "";
  };

  const runCompression = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    clearResult();
    setError("");
    if (!file) {
      setError("Choose an image before compressing.");
      return;
    }
    setBusy(true);
    try {
      const compressed = await compressImage(file, { format, quality: quality / 100, maxDimension: Number(maxDimension) });
      setDimensions({ width: compressed.width, height: compressed.height });
      setOutputBlob(compressed.blob);
      setOutputUrl(URL.createObjectURL(compressed.blob));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "The image could not be compressed.");
    } finally {
      setBusy(false);
    }
  };

  const saveOutput = () => {
    if (!outputUrl) return;
    const anchor = document.createElement("a");
    anchor.href = outputUrl;
    anchor.download = `qitool-compressed.${format.split("/")[1]}`;
    anchor.click();
  };
  const savingPercent = file && outputBlob ? Math.round((1 - outputBlob.size / file.size) * 100) : 0;

  return <>
    <form noValidate className="tool-form" onSubmit={runCompression}>
      <div className="tool-field">
        <label htmlFor="image-file">Choose an image</label>
        <input id="image-file" className="tool-file-input" type="file" accept="image/jpeg,image/png,image/webp" onChange={onFileChange} disabled={busy} />
        <p className="tool-field-hint">JPEG, PNG, or WebP. Maximum input file size: 20 MB; maximum input resolution: 40 megapixels. The file stays on this device.</p>
      </div>
      {file && <p className="selected-file"><ImageIcon size={15} aria-hidden="true" /><strong>{file.name}</strong><span>{formatBytes(file.size)}</span></p>}
      <div className="tool-form-grid">
        <SelectField id="image-format" label="Output format" value={format} onChange={(value) => { setFormat(value as ImageOutputFormat); clearResult(); }} options={[{ value: "image/jpeg", label: "JPEG" }, { value: "image/png", label: "PNG (lossless)" }, { value: "image/webp", label: "WebP" }]} />
        <SelectField id="image-dimensions" label="Maximum edge" value={maxDimension} onChange={(value) => { setMaxDimension(value); clearResult(); }} options={[{ value: "1000", label: "1,000 pixels" }, { value: "2000", label: "2,000 pixels" }, { value: "3000", label: "3,000 pixels" }, { value: "6000", label: "6,000 pixels" }]} />
      </div>
      <label className="tool-range-field" htmlFor="image-quality"><span><strong>Quality</strong><span>{quality}%</span></span><input id="image-quality" type="range" min="10" max="100" step="1" value={quality} onChange={(event) => { setQuality(Number(event.target.value)); clearResult(); }} disabled={format === "image/png"} /><small>{format === "image/png" ? "PNG is lossless; quality does not change its encoding." : "Lower quality usually creates a smaller file."}</small></label>
      <ToolActions onReset={reset} calculateLabel="Compress image" busy={busy} />
      <ErrorNotice message={error} />
    </form>
    {(inputUrl || outputUrl) && <section className="image-preview-grid" aria-label="Image preview">
      {inputUrl && <figure className="image-preview-card"><Image src={inputUrl} alt={`Original image: ${file?.name ?? "uploaded file"}`} width={640} height={480} unoptimized /><figcaption>Original <span>{file ? formatBytes(file.size) : ""}</span></figcaption></figure>}
      {outputUrl && outputBlob && dimensions && <figure className="image-preview-card"><Image src={outputUrl} alt="Compressed image preview" width={dimensions.width} height={dimensions.height} unoptimized /><figcaption>Compressed <span>{formatBytes(outputBlob.size)} · {dimensions.width} × {dimensions.height}</span></figcaption></figure>}
    </section>}
    {outputUrl && outputBlob && <section className="image-result" aria-live="polite"><div><strong>{savingPercent > 0 ? `${savingPercent}% smaller` : savingPercent < 0 ? `${Math.abs(savingPercent)}% larger` : "Similar file size"}</strong><span>Compression is complete. Compare image quality before using the downloaded file.</span></div><button type="button" className="tool-submit image-download-button" onClick={saveOutput}><Download size={15} aria-hidden="true" />Download image</button></section>}
  </>;
}
