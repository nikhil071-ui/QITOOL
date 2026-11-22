"use client";

import { useEffect, useRef, useState, type FormEvent, type ChangeEvent } from "react";
import Image from "next/image";
import { Download, Image as ImageIcon } from "lucide-react";
import { compressImage, type ImageCompressionResult, type ImageOutputFormat } from "@/lib/image-processing";
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
  const [output, setOutput] = useState<(ImageCompressionResult & { url: string }) | null>(null);
  const [format, setFormat] = useState<ImageOutputFormat>("image/jpeg");
  const [quality, setQuality] = useState(80);
  const [maxDimension, setMaxDimension] = useState("2000");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);

  useEffect(() => () => {
    if (inputUrl) URL.revokeObjectURL(inputUrl);
  }, [inputUrl]);

  useEffect(() => () => {
    if (output) URL.revokeObjectURL(output.url);
  }, [output]);

  const clearResult = () => {
    setOutput(null);
    setError("");
  };

  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextFile = event.currentTarget.files?.[0];
    if (!nextFile) return;
    clearResult();
    try {
      validateImageFile(nextFile);
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
    const input = document.getElementById("image-file") as HTMLInputElement | null;
    if (input) input.value = "";
  };

  const runCompression = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (busy) return;
    clearResult();
    if (!file) {
      setError("Choose an image before compressing.");
      return;
    }
    setBusy(true);
    try {
      const compressed = await compressImage(file, { format, quality: quality / 100, maxDimension: Number(maxDimension) });
      if (mounted.current) {
        setOutput({ ...compressed, url: URL.createObjectURL(compressed.blob) });
      }
    } catch (cause) {
      if (mounted.current) setError(cause instanceof Error ? cause.message : "The image could not be compressed.");
    } finally {
      if (mounted.current) setBusy(false);
    }
  };

  const savingPercent = output ? Math.round((1 - output.outputBytes / output.originalBytes) * 100) : 0;

  return <>
    <form noValidate className="tool-form" onSubmit={runCompression}>
      <div className="tool-field">
        <label htmlFor="image-file">Choose an image</label>
        <input id="image-file" className="tool-file-input" type="file" accept="image/jpeg,image/png,image/webp" onChange={onFileChange} disabled={busy} aria-describedby="image-file-hint" />
        <p id="image-file-hint" className="tool-field-hint">JPEG, PNG, or WebP. Maximum input file size: 20 MB; maximum input resolution: 40 megapixels. The file stays on this device.</p>
      </div>
      {file && <p className="selected-file"><ImageIcon size={15} aria-hidden="true" /><strong>{file.name}</strong><span>{formatBytes(file.size)}</span></p>}
      <div className="tool-form-grid">
        <SelectField id="image-format" label="Output format" value={format} disabled={busy} onChange={(value) => { setFormat(value as ImageOutputFormat); clearResult(); }} options={[{ value: "image/jpeg", label: "JPEG" }, { value: "image/png", label: "PNG (lossless)" }, { value: "image/webp", label: "WebP" }]} />
        <SelectField id="image-dimensions" label="Maximum edge" value={maxDimension} disabled={busy} onChange={(value) => { setMaxDimension(value); clearResult(); }} options={[{ value: "1000", label: "1,000 pixels" }, { value: "2000", label: "2,000 pixels" }, { value: "3000", label: "3,000 pixels" }, { value: "6000", label: "6,000 pixels" }]} />
      </div>
      <div className="tool-range-field"><label htmlFor="image-quality"><strong>Quality</strong><span>{quality}%</span></label><input id="image-quality" type="range" min="10" max="100" step="1" value={quality} onChange={(event) => { setQuality(Number(event.target.value)); clearResult(); }} disabled={busy || format === "image/png"} aria-describedby="image-quality-hint" /><small id="image-quality-hint">{format === "image/png" ? "PNG preserves the resized pixels. Reducing the dimensions can still remove detail." : "Lower quality usually creates a smaller file."}</small></div>
      <ToolActions onReset={reset} calculateLabel="Compress image" busy={busy} />
      <ErrorNotice message={error} />
    </form>
    {(inputUrl || output) && <section className="image-preview-grid" aria-label="Image preview">
      {inputUrl && <figure className="image-preview-card"><Image src={inputUrl} alt={`Original image: ${file?.name ?? "uploaded file"}`} width={640} height={480} unoptimized /><figcaption>Original <span>{file ? formatBytes(file.size) : ""}</span></figcaption></figure>}
      {output && <figure className="image-preview-card"><Image src={output.url} alt="Compressed image preview" width={output.width} height={output.height} unoptimized /><figcaption>Compressed <span>{formatBytes(output.outputBytes)} · {output.width} × {output.height}</span></figcaption></figure>}
    </section>}
    {output && <section className="image-result" aria-live="polite"><div><strong>{savingPercent > 0 ? `${savingPercent}% smaller` : savingPercent < 0 ? `${Math.abs(savingPercent)}% larger` : "Similar file size"}</strong><span>Compression is complete. Compare image quality before using the downloaded file.</span></div><a className="tool-submit image-download-button" href={output.url} download={`qitool-compressed.${output.outputType.split("/")[1]}`}><Download size={15} aria-hidden="true" />Download image</a></section>}
  </>;
}
