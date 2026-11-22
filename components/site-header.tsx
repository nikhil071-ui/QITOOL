import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Search } from "lucide-react";
import { toolCategories } from "@/lib/tools";
import { MobileNavigation } from "@/components/mobile-navigation";
import { DesktopNavigation } from "@/components/desktop-navigation";
import { ThemeToggle } from "@/components/theme-toggle";

const mainLinks = [
  { label: "Home", href: "/" },
  { label: "All Tools", href: "/tools" },
  ...toolCategories.slice(1).map((category) => ({
    label: category.id === "text" ? "Text Tools" : category.id === "images" ? "Image Tools" : category.label,
    href: category.href,
  })),
  { label: "About Us", href: "/about" },
];

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="announcement-bar">
        <span className="announcement-dot" aria-hidden="true" />
        Free tools for everyday tasks
        <Link href="/tools" className="announcement-link">
          Explore QITOOL <ArrowUpRight size={13} aria-hidden="true" />
        </Link>
      </div>
      <div className="header-shell">
        <Link href="/" className="brand" aria-label="QITOOL home">
          <Image src="/brand/logo.png" alt="" width={1800} height={520} className="brand-logo brand-logo-horizontal logo-on-light" sizes="180px" />
          <Image src="/brand/logo-dark.png" alt="" width={1800} height={520} className="brand-logo brand-logo-horizontal logo-on-dark" sizes="180px" />
          <Image src="/brand/logo-icon.png" alt="" width={1024} height={1024} className="brand-logo brand-logo-compact" sizes="40px" />
        </Link>

        <DesktopNavigation links={mainLinks} />
        <div className="header-tools">
          <Link href="/tools#tool-search" className="header-cta" aria-label="Search tools"><Search size={15} aria-hidden="true" /><span>Search</span></Link>
          <ThemeToggle />
        </div>
        <MobileNavigation links={[...mainLinks, { label: "Search tools", href: "/tools#tool-search" }]} />
      </div>
    </header>
  );
}
