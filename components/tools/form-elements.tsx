"use client";

import { useCallback, useState, type FormEventHandler, type ReactNode } from "react";
import { AlertCircle, Check, Clipboard, RotateCcw } from "lucide-react";
import { calculateSubmission, currentSubmission } from "@/lib/submitted-calculation";

type FieldProps = { id: string; label: string; hint?: string; children: ReactNode };

export function ToolField({ id, label, hint, children }: FieldProps) {
  return (
    <div className="tool-field">
      <label htmlFor={id}>{label}</label>
      {children}
      {hint && <p id={`${id}-hint`} className="tool-field-hint">{hint}</p>}
    </div>
  );
}

type NumberFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
  min?: number;
  max?: number;
  step?: number | "any";
  placeholder?: string;
};

export function NumberField({ id, label, value, onChange, hint, min, max, step = "any", placeholder }: NumberFieldProps) {
  return (
    <ToolField id={id} label={label} hint={hint}>
      <input id={id} aria-describedby={hint ? `${id}-hint` : undefined} className="tool-input" type="number" inputMode="decimal" value={value} min={min} max={max} step={step} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} />
    </ToolField>
  );
}

type TextFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
  type?: "text" | "date" | "url";
  placeholder?: string;
  maxLength?: number;
};

export function TextField({ id, label, value, onChange, hint, type = "text", placeholder, maxLength }: TextFieldProps) {
  return (
    <ToolField id={id} label={label} hint={hint}>
      <input id={id} aria-describedby={hint ? `${id}-hint` : undefined} className="tool-input" type={type} value={value} placeholder={placeholder} maxLength={maxLength} onChange={(event) => onChange(event.target.value)} />
    </ToolField>
  );
}

export type SelectOption = { value: string; label: string };

type SelectFieldProps = { id: string; label: string; value: string; onChange: (value: string) => void; options: SelectOption[]; hint?: string; disabled?: boolean };

export function SelectField({ id, label, value, onChange, options, hint, disabled }: SelectFieldProps) {
  return (
    <ToolField id={id} label={label} hint={hint}>
      <select id={id} aria-describedby={hint ? `${id}-hint` : undefined} className="tool-input tool-select" value={value} disabled={disabled} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => <option value={option.value} key={option.value}>{option.label}</option>)}
      </select>
    </ToolField>
  );
}

type ToolActionsProps = { onReset: () => void; calculateLabel?: string; resetLabel?: string; busy?: boolean };

export function ToolActions({ onReset, calculateLabel = "Calculate", resetLabel = "Reset", busy = false }: ToolActionsProps) {
  return (
    <div className="tool-actions">
      <button type="submit" className="tool-submit" disabled={busy}>{busy ? "Working…" : calculateLabel}</button>
      <button type="button" className="tool-reset" onClick={onReset} disabled={busy}><RotateCcw size={14} aria-hidden="true" />{resetLabel}</button>
    </div>
  );
}

export function ErrorNotice({ message }: { message: string }) {
  if (!message) return null;
  return <p className="tool-error" role="alert"><AlertCircle size={16} aria-hidden="true" />{message}</p>;
}

export function useToolCalculation<Result>() {
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");

  const run = useCallback((operation: () => Result) => {
    setError("");
    try {
      setResult(operation());
    } catch (cause) {
      setResult(null);
      setError(cause instanceof Error ? cause.message : "Unable to calculate with those values.");
    }
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setError("");
  }, []);

  const submit: FormEventHandler<HTMLFormElement> = useCallback((event) => event.preventDefault(), []);
  return { result, error, run, reset, setError, submit };
}

export function useSubmittedCalculation<Inputs extends Record<string, string>, Value>(inputs: Inputs, calculate: (snapshot: Inputs) => Value) {
  const calc = useToolCalculation<{ inputs: Inputs; value: Value }>();
  const submit: FormEventHandler<HTMLFormElement> = event => {
    event.preventDefault();
    calc.run(() => calculateSubmission(inputs, calculate));
  };
  const submission = currentSubmission(calc.result, inputs);
  return { result: submission?.value, inputs: submission?.inputs, error: calc.error, reset: calc.reset, submit };
}

export function CopyButton({ text, label = "Copy result" }: { text: string; label?: string }) {
  const [status, setStatus] = useState("");
  const copy = async () => {
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard access is not available.");
      await navigator.clipboard.writeText(text);
      setStatus("Copied");
      window.setTimeout(() => setStatus(""), 1800);
    } catch {
      setStatus("Copy unavailable");
      window.setTimeout(() => setStatus(""), 2500);
    }
  };
  return (
    <button type="button" className="copy-result-button" onClick={copy} aria-label={status === "Copied" ? "Result copied" : label}>
      {status === "Copied" ? <Check size={14} aria-hidden="true" /> : <Clipboard size={14} aria-hidden="true" />}
      <span>{status || label}</span>
    </button>
  );
}

export function ResultPanel({ title = "Your result", copyText, children }: { title?: string; copyText: string; children: ReactNode }) {
  return (
    <section className="tool-result" aria-live="polite">
      <div className="tool-result-header"><h3>{title}</h3><CopyButton text={copyText} /></div>
      {children}
    </section>
  );
}

export function ResultStat({ label, value, prominent = false }: { label: string; value: string; prominent?: boolean }) {
  return <div className={prominent ? "result-stat result-stat-primary" : "result-stat"}><span>{label}</span><strong>{value}</strong></div>;
}

export function formatDateLabel(value: string): string {
  const [year, month, day] = value.split("-").map(Number);
  return new Intl.DateTimeFormat("en-IN", { dateStyle: "long", timeZone: "UTC" }).format(new Date(Date.UTC(year, month - 1, day)));
}
