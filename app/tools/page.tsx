import { CircleHelp } from "lucide-react";
import { ToolDirectory } from "@/components/tool-directory";
import { PageIntro } from "@/components/page-intro";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata("All 15 Calculators and Browser Tools", "Browse free calculators, text utilities, image tools, and unit converters, with instructions and examples for every tool.", "/tools");

export default function ToolsPage() {
  return (
    <main id="main-content" className="inner-page">
      <div className="page-shell">
        <PageIntro title="Online calculators and browser tools" description="Browse calculators, text utilities, image tools, and converters. Each tool includes clear instructions and runs in your browser where possible." crumbs={[{ label: "All tools" }]} />
        <div className="inner-directory"><h2 className="sr-only">Browse the tool directory</h2><ToolDirectory /></div>
        <div className="roadmap-note"><span className="roadmap-note-icon"><CircleHelp size={18} aria-hidden="true" /></span><p><strong>Use a tool right away.</strong> Each page explains its method, assumptions, and limits alongside the interactive calculator or utility.</p></div>
      </div>
    </main>
  );
}
