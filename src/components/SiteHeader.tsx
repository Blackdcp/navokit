"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

export default function SiteHeader({ lang }: { lang: string }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const items = lang === "zh"
    ? [
        ["工具", `/${lang}/tools`],
        ["指南", `/${lang}/blog`],
        ["关于", `/${lang}/about`],
        ["联系", `/${lang}/contact`],
      ]
    : [
        ["Tools", `/${lang}/tools`],
        ["Guides", `/${lang}/blog`],
        ["About", `/${lang}/about`],
        ["Contact", `/${lang}/contact`],
      ];

  function switchLanguage() {
    const next = lang === "zh" ? "en" : "zh";
    router.push(pathname.replace(/^\/(en|zh)/, `/${next}`));
    setOpen(false);
  }

  return (
    <header className="site-header">
      <div className="marketing-container site-header__inner">
        <Link href={`/${lang}`} className="brand-logo" aria-label="NavoKit home">
          <Image src="/logo.png" alt="NavoKit" width={1672} height={941} priority />
        </Link>

        <nav className="site-header__nav" aria-label="Main navigation">
          {items.map(([label, href]) => <Link key={label} href={href}>{label}</Link>)}
        </nav>

        <div className="site-header__actions">
          <button className="language-button" onClick={switchLanguage}>{lang === "zh" ? "EN" : "中文"}</button>
          <Link className="button button--ink button--small" href={`/${lang}/tools`}>
            {lang === "zh" ? "浏览工具" : "Explore tools"}
          </Link>
        </div>

        <button className="menu-button" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Toggle menu">
          <span />
          <span />
        </button>
      </div>

      {open && (
        <nav className="mobile-menu" aria-label="Mobile navigation">
          {items.map(([label, href]) => <Link key={label} href={href} onClick={() => setOpen(false)}>{label}</Link>)}
          <button onClick={switchLanguage}>{lang === "zh" ? "Switch to English" : "切换到中文"}</button>
          <Link className="button button--ink" href={`/${lang}/tools`} onClick={() => setOpen(false)}>
            {lang === "zh" ? "浏览工具" : "Explore tools"}
          </Link>
        </nav>
      )}
    </header>
  );
}
