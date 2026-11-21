import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronRight, Home } from "lucide-react";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbStructuredData } from "@/lib/structured-data";

type PageIntroProps = { title: string; description: ReactNode; eyebrow?: string; crumbs?: { label: string; href?: string }[] };

export function PageIntro({ title, description, eyebrow = "QITOOL", crumbs = [] }: PageIntroProps) {
  const breadcrumbData = breadcrumbStructuredData(crumbs);
  return (
    <div className="page-intro">
      {breadcrumbData && <JsonLd data={breadcrumbData} />}
      <nav aria-label="Breadcrumb">
        <ol className="breadcrumbs">
          <li><Link href="/" aria-label="Home"><Home size={13} aria-hidden="true" /></Link></li>
          {crumbs.map((crumb) => (
          <li key={crumb.label} className="breadcrumb-part">
            <ChevronRight size={13} aria-hidden="true" />
            {crumb.href ? <Link href={crumb.href}>{crumb.label}</Link> : <span aria-current="page">{crumb.label}</span>}
          </li>
          ))}
        </ol>
      </nav>
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p className="page-intro-description">{description}</p>
    </div>
  );
}
