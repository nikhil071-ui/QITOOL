"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import QRCode from "qrcode";
import { Download, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { convertUnit, formatValue, parseNumericInput, unitOptions, validateQrContent, type UnitCategory } from "@/lib/calculations";
import { generateSecurePassword, type PasswordOptions } from "@/lib/password";
import {
  ErrorNotice, NumberField, ResultPanel, SelectField,
  TextField, ToolActions, useSubmittedCalculation,
} from "@/components/tools/form-elements";

const defaultPasswordOptions: PasswordOptions = { lowercase: true, uppercase: true, numbers: true, symbols: true };

export function PasswordGenerator() {
  const [length, setLength] = useState("16");
  const [options, setOptions] = useState<PasswordOptions>(defaultPasswordOptions);
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState("");
  const create = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    try {
      setPassword(generateSecurePassword(parseNumericInput(length, "Password length"), options));
    } catch (cause) {
      setPassword("");
      setError(cause instanceof Error ? cause.message : "Could not generate a password.");
    }
  };
  const reset = () => { setLength("16"); setOptions(defaultPasswordOptions); setPassword(""); setVisible(false); setError(""); };
  const toggle = (name: keyof PasswordOptions) => setOptions((current) => ({ ...current, [name]: !current[name] }));

  return <>
    <form noValidate className="tool-form" onSubmit={create}>
      <NumberField id="password-length" label="Password length" value={length} onChange={setLength} min={8} max={128} step={1} hint="Choose 8 to 128 characters." />
      <fieldset className="tool-checks"><legend>Include character types</legend>
        {(Object.entries({ lowercase: "Lowercase letters (a-z)", uppercase: "Uppercase letters (A-Z)", numbers: "Numbers (0-9)", symbols: "Symbols (!@#…)" }) as [keyof PasswordOptions, string][]).map(([name, label]) => <label className="tool-checkbox" key={name}><input type="checkbox" checked={options[name]} onChange={() => toggle(name)} /><span>{label}</span></label>)}
      </fieldset>
      <ToolActions onReset={reset} calculateLabel="Generate password" />
      <ErrorNotice message={error} />
    </form>
    {password && <ResultPanel copyText={password} title="Generated password">
      <div className="password-output"><input aria-label="Generated password" type={visible ? "text" : "password"} value={password} readOnly /><button type="button" className="password-visibility" onClick={() => setVisible((current) => !current)} aria-label={visible ? "Hide password" : "Show password"}>{visible ? <EyeOff size={16} /> : <Eye size={16} />}</button></div>
      <p className="result-caution"><ShieldCheck size={15} aria-hidden="true" />Generated here in your browser. Save it in a password manager and do not reuse it.</p>
    </ResultPanel>}
  </>;
}

const categoryLabels: Record<UnitCategory, string> = { length: "Length", weight: "Weight", temperature: "Temperature", volume: "Volume" };
const defaultUnitPair: Record<UnitCategory, [string, string]> = { length: ["kilometre", "mile"], weight: ["kilogram", "pound"], temperature: ["celsius", "fahrenheit"], volume: ["litre", "gallon"] };

export function UnitConverter() {
  const [category, setCategory] = useState<UnitCategory>("length");
  const [value, setValue] = useState("5");
  const [from, setFrom] = useState("kilometre");
  const [to, setTo] = useState("mile");
  const calc = useSubmittedCalculation({ value, category, from, to }, input =>
    convertUnit(parseNumericInput(input.value, "Value"), input.category, input.from, input.to));
  const options = unitOptions[category];
  const reset = () => { setCategory("length"); setValue("5"); setFrom("kilometre"); setTo("mile"); calc.reset(); };
  const changeCategory = (raw: string) => {
    const next = raw as UnitCategory;
    setCategory(next);
    const [nextFrom, nextTo] = defaultUnitPair[next];
    setFrom(nextFrom);
    setTo(nextTo);
  };
  const fromLabel = calc.inputs ? unitOptions[calc.inputs.category].find(unit => unit.value === calc.inputs?.from)?.label ?? calc.inputs.from : "";
  const toLabel = calc.inputs ? unitOptions[calc.inputs.category].find(unit => unit.value === calc.inputs?.to)?.label ?? calc.inputs.to : "";

  return <>
    <form noValidate className="tool-form" onSubmit={calc.submit} onChange={calc.reset}>
      <SelectField id="unit-category" label="Measurement" value={category} onChange={changeCategory} options={(Object.keys(categoryLabels) as UnitCategory[]).map((id) => ({ value: id, label: categoryLabels[id] }))} />
      <NumberField id="unit-value" label="Value" value={value} onChange={setValue} step="any" />
      <div className="tool-form-grid">
        <SelectField id="unit-from" label="From" value={from} onChange={setFrom} options={options} />
        <SelectField id="unit-to" label="To" value={to} onChange={setTo} options={options} />
      </div>
      <ToolActions onReset={reset} calculateLabel="Convert units" />
      <ErrorNotice message={calc.error} />
    </form>
    {calc.result !== undefined && calc.inputs && <ResultPanel copyText={`${calc.inputs.value} ${fromLabel} = ${formatValue(calc.result)} ${toLabel}.`}>
      <p className="result-equation">{calc.inputs.value} {fromLabel} equals</p>
      <div className="result-highlight">{formatValue(calc.result)}<span> {toLabel}</span></div>
      <p className="result-supporting">{categoryLabels[calc.inputs.category]} conversion</p>
    </ResultPanel>}
  </>;
}

export function QrCodeGenerator() {
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const reset = () => { setContent(""); setImageUrl(""); setError(""); setBusy(false); };
  const generate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setImageUrl("");
    setError("");
    let normalized: string;
    try {
      normalized = validateQrContent(content);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Enter text to encode.");
      return;
    }
    setBusy(true);
    try {
      const dataUrl = await QRCode.toDataURL(normalized, { width: 512, margin: 4, errorCorrectionLevel: "M" });
      setImageUrl(dataUrl);
    } catch {
      setError("This content could not fit into a QR code. Shorten it and try again.");
    } finally {
      setBusy(false);
    }
  };

  return <>
    <form noValidate className="tool-form" onSubmit={generate}>
      <TextField id="qr-content" label="Web address or text" value={content} onChange={setContent} maxLength={2001} placeholder="https://example.com" hint={`${content.length} / 2,000 characters. Generated locally; do not encode passwords or private information.`} />
      <ToolActions onReset={reset} calculateLabel="Generate QR code" busy={busy} />
      <ErrorNotice message={error} />
    </form>
    {imageUrl && <ResultPanel copyText={content} title="Your QR code">
      <div className="qr-result"><Image src={imageUrl} alt="Generated QR code preview" width={256} height={256} unoptimized /><p>Scan this preview or download the PNG.</p><a className="download-schedule" href={imageUrl} download="qitool-qr-code.png"><Download size={14} aria-hidden="true" />Download PNG</a></div>
    </ResultPanel>}
  </>;
}
