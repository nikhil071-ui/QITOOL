"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, Search, X } from "lucide-react";
import Link from "next/link";
import { filterTools, toolCategories, type ToolCategoryId } from "@/lib/tools";
import { ToolCard } from "@/components/tool-card";

type ToolDirectoryProps = {
  initialCategory?: ToolCategoryId | "all";
  compact?: boolean;
};

export function ToolDirectory({ initialCategory = "all", compact = false }: ToolDirectoryProps) {
  const [activeCategory, setActiveCategory] = useState<ToolCategoryId | "all">(initialCategory);
  const [query, setQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function focusSearch(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
    }
    window.addEventListener("keydown", focusSearch);
    return () => window.removeEventListener("keydown", focusSearch);
  }, []);

  useEffect(() => {
    if (window.location.hash === "#tool-search") searchInputRef.current?.focus({ preventScroll: true });
  }, []);

  const visibleTools = useMemo(() => filterTools(query, activeCategory), [activeCategory, query]);

  return (
    <div className={compact ? "directory directory-compact" : "directory"}>
      <div className="directory-controls">
        <label className="search-field">
          <Search size={19} aria-hidden="true" />
          <span className="sr-only">Search tools</span>
          <input
            ref={searchInputRef}
            id="tool-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search calculators, text and image tools..."
            aria-controls="tool-card-list"
          />
          {query && <button className="clear-search" type="button" onClick={() => setQuery("")} aria-label="Clear search"><X size={16} /></button>}
          <kbd>⌘ / Ctrl K</kbd>
        </label>
        <div className="filter-list" role="group" aria-label="Filter tools by category">
          {toolCategories.map((category) => initialCategory !== "all" ? (
            <Link key={category.id} href={category.href}
              className={initialCategory === category.id ? "filter-chip filter-chip-active" : "filter-chip"}
              aria-current={initialCategory === category.id ? "page" : undefined}>
              {initialCategory === category.id && <Check size={13} aria-hidden="true" />}
              {category.label}
            </Link>
          ) : (
            <button
              key={category.id}
              type="button"
              className={activeCategory === category.id ? "filter-chip filter-chip-active" : "filter-chip"}
              aria-pressed={activeCategory === category.id}
              onClick={() => setActiveCategory(category.id)}
            >
              {activeCategory === category.id && <Check size={13} aria-hidden="true" />}
              {category.label}
            </button>
          ))}
        </div>
      </div>

      <p className="sr-only" aria-live="polite" aria-atomic="true">{visibleTools.length} {visibleTools.length === 1 ? "tool" : "tools"} shown.</p>
      <div className="tool-grid" id="tool-card-list">
        {visibleTools.map((tool, index) => <ToolCard tool={tool} index={index} key={tool.slug} />)}
      </div>
      {visibleTools.length === 0 && (
        <div className="empty-state">
          <span className="empty-search-icon"><Search size={21} aria-hidden="true" /></span>
          <h3>No tools match that search</h3>
          <p>Try a shorter phrase or choose a different category.</p>
          <button type="button" className="text-button" onClick={() => { setQuery(""); setActiveCategory(initialCategory); }}>Clear filters <X size={14} /></button>
        </div>
      )}
    </div>
  );
}
