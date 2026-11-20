"use client";

import Link from "next/link";
import {
  ArrowLeftRight, ArrowUpRight, CalendarDays, Clock3, HeartPulse, Image as ImageIcon, Keyboard,
  Landmark, LockKeyhole, Percent, QrCode, ReceiptText, Ruler, Tag, Type, Wallet,
  type LucideIcon,
} from "lucide-react";
import { categoryLabels, type ToolCategoryId, type ToolInfo } from "@/lib/tools";

const iconByName: Record<ToolInfo["icon"], LucideIcon> = {
  calendar: CalendarDays,
  percent: Percent,
  heart: HeartPulse,
  wallet: Wallet,
  receipt: ReceiptText,
  type: Type,
  scan: QrCode,
  key: LockKeyhole,
  ruler: Ruler,
  image: ImageIcon,
  keyboard: Keyboard,
  tag: Tag,
  clock: Clock3,
  landmark: Landmark,
};

const categoryThemes: Record<ToolCategoryId, string> = {
  calculators: "icon-blue",
  text: "icon-violet",
  images: "icon-cyan",
  productivity: "icon-teal",
  converters: "icon-purple",
};

export function ToolCard({ tool, index = 0 }: { tool: ToolInfo; index?: number }) {
  const Icon = iconByName[tool.icon];

  return (
    <Link
      className="tool-card"
      href={`/tools/${tool.slug}`}
      style={{ animationDelay: `${Math.min(index, 8) * 45}ms` }}
      onPointerMove={(event) => {
        if (event.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width - 0.5;
        const y = (event.clientY - bounds.top) / bounds.height - 0.5;
        event.currentTarget.style.setProperty("--tilt-x", `${x * 5}deg`);
        event.currentTarget.style.setProperty("--tilt-y", `${y * -5}deg`);
      }}
      onPointerLeave={(event) => {
        event.currentTarget.style.setProperty("--tilt-x", "0deg");
        event.currentTarget.style.setProperty("--tilt-y", "0deg");
      }}
    >
      <div className="tool-card-top">
        <span className={`tool-icon ${categoryThemes[tool.category]}`}><Icon size={21} strokeWidth={1.8} aria-hidden="true" /></span>
        <span className="tool-card-arrow" aria-hidden="true"><ArrowUpRight size={16} /></span>
      </div>
      <h3>{tool.name}</h3>
      <p>{tool.description}</p>
      <div className="tool-card-foot">
        <span className="tool-card-category">{categoryLabels[tool.category]}</span>
        <span className="tool-card-open">Open Tool <ArrowLeftRight size={14} aria-hidden="true" /></span>
      </div>
    </Link>
  );
}
