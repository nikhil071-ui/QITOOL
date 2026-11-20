"use client";

import Link from "next/link";
import { ArrowUpRight, Menu, X } from "lucide-react";

type MobileNavigationProps = {
  links: { label: string; href: string }[];
};

export function MobileNavigation({ links }: MobileNavigationProps) {
  return (
    <details className="mobile-menu">
      <summary aria-label="Open navigation menu"><Menu className="mobile-menu-open-icon" size={22} aria-hidden="true" /><X className="mobile-menu-close-icon" size={22} aria-hidden="true" /></summary>
      <button className="mobile-menu-backdrop" type="button" aria-label="Close navigation menu" onClick={(event) => event.currentTarget.closest("details")?.removeAttribute("open")} />
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
