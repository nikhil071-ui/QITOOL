"use client";

import Link from "next/link";
import { ArrowUpRight, Menu, X } from "lucide-react";

type MobileNavigationProps = {
  links: { label: string; href: string }[];
};

export function MobileNavigation({ links }: MobileNavigationProps) {
  function dismissMenu(menu: HTMLDetailsElement) {
    menu.open = false;
    menu.querySelector("summary")?.focus();
  }

  return (
    <details
      className="mobile-menu"
      onKeyDown={(event) => {
        if (event.key === "Escape" && event.currentTarget.open) {
          event.preventDefault();
          dismissMenu(event.currentTarget);
        }
      }}
      onBlur={(event) => {
        if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget)) {
          event.currentTarget.open = false;
        }
      }}
    >
      <summary aria-label="Navigation menu"><Menu className="mobile-menu-open-icon" size={22} aria-hidden="true" /><X className="mobile-menu-close-icon" size={22} aria-hidden="true" /></summary>
      <button className="mobile-menu-backdrop" type="button" tabIndex={-1} aria-label="Close navigation menu" onClick={(event) => {
        const menu = event.currentTarget.closest("details");
        if (menu) dismissMenu(menu);
      }} />
      <nav aria-label="Mobile navigation">
        <div className="mobile-menu-heading"><strong>Explore QITOOL</strong><span>Smart Tools. Simple Life.</span></div>
        {links.map((link) => (
          <Link key={link.href} href={link.href} onClick={(event) => event.currentTarget.closest("details")?.removeAttribute("open")}>
            {link.label}<ArrowUpRight size={14} aria-hidden="true" />
          </Link>
        ))}
      </nav>
    </details>
  );
}
