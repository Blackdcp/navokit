import type { ReactNode } from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import "./site-information.css";

export default function SiteInformationPage({ lang, label, title, lead, children, narrow = false }: {
  lang: "en" | "zh";
  label: string;
  title: string;
  lead: string;
  children: ReactNode;
  narrow?: boolean;
}) {
  return (
    <div className="site-shell">
      <SiteHeader lang={lang} />
      <main className={`marketing-container information-page${narrow ? " information-page--narrow" : ""}`}>
        <header className="information-heading">
          <span>{label}</span>
          <h1>{title}</h1>
          <p>{lead}</p>
        </header>
        {children}
      </main>
      <SiteFooter lang={lang} />
    </div>
  );
}
