"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavigationLink = { label: string; href: string };

export function DesktopNavigation({ links }: { links: NavigationLink[] }) {
  const pathname = usePathname();

  return (
    <nav className="desktop-nav" aria-label="Main navigation">
      {links.map((link) => {
        const active = pathname === link.href;
        return (
          <Link key={link.href} href={link.href} className={active ? "nav-link nav-link-active" : "nav-link"} aria-current={active ? "page" : undefined}>
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
