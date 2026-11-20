"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";

const ToolLoading = () => <div className="tool-loading" role="status">Loading tool…</div>;

const interfaces: Record<string, ComponentType> = {
  "age-calculator": dynamic(() => import("./calculator-tools").then((module) => module.AgeCalculator), { loading: ToolLoading }),
  "percentage-calculator": dynamic(() => import("./calculator-tools").then((module) => module.PercentageCalculator), { loading: ToolLoading }),
  "bmi-calculator": dynamic(() => import("./calculator-tools").then((module) => module.BmiCalculator), { loading: ToolLoading }),
  "emi-calculator": dynamic(() => import("./calculator-tools").then((module) => module.EmiCalculator), { loading: ToolLoading }),
  "gst-calculator": dynamic(() => import("./calculator-tools").then((module) => module.GstCalculator), { loading: ToolLoading }),
  "date-calculator": dynamic(() => import("./calculator-tools").then((module) => module.DateCalculator), { loading: ToolLoading }),
  "discount-calculator": dynamic(() => import("./calculator-tools").then((module) => module.DiscountCalculator), { loading: ToolLoading }),
  "loan-calculator": dynamic(() => import("./calculator-tools").then((module) => module.LoanCalculator), { loading: ToolLoading }),
  "word-counter": dynamic(() => import("./text-tools").then((module) => module.WordCounter), { loading: ToolLoading }),
  "character-counter": dynamic(() => import("./text-tools").then((module) => module.CharacterCounter), { loading: ToolLoading }),
  "typing-speed-test": dynamic(() => import("./text-tools").then((module) => module.TypingSpeedTest), { loading: ToolLoading }),
  "password-generator": dynamic(() => import("./utility-tools").then((module) => module.PasswordGenerator), { loading: ToolLoading }),
  "unit-converter": dynamic(() => import("./utility-tools").then((module) => module.UnitConverter), { loading: ToolLoading }),
  "qr-code-generator": dynamic(() => import("./utility-tools").then((module) => module.QrCodeGenerator), { loading: ToolLoading }),
  "image-compressor": dynamic(() => import("./image-compressor").then((module) => module.ImageCompressor), { loading: ToolLoading }),
};

export function ToolInterface({ slug }: { slug: string }) {
  const Interface = interfaces[slug];
  if (!Interface) return <p className="tool-error" role="alert">This tool is not available.</p>;
  return <Interface />;
}
