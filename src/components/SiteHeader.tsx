"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";

type LanguageSwitchProps = { href: string; zh: boolean; onClick?: () => void };

function LanguageOptions({ href, zh, onClick }: LanguageSwitchProps) {
  return <div className="site-language-switch" role="group" aria-label={zh ? "网站语言" : "Site language"}>
    {(["zh", "en"] as const).map(locale => {
      const label = locale === "zh" ? "中文" : "EN";
      const current = locale === (zh ? "zh" : "en");
      return current
        ? <span key={locale} className="site-language-option is-current" lang={locale} aria-current="true" aria-label={zh ? "当前语言：中文" : "Current language: English"}>{label}</span>
        : <Link key={locale} href={href} className="site-language-option" lang={locale} hrefLang={locale} aria-label={locale === "zh" ? "切换为中文" : "Switch to English"} title={locale === "zh" ? "切换为中文" : "Switch to English"} onClick={onClick}>{label}</Link>;
    })}
  </div>;
}

function LanguageSwitch({ href, zh, onClick }: LanguageSwitchProps) {
  const searchParams = useSearchParams();
  const query = searchParams.toString();
  return <LanguageOptions href={`${href}${query ? `?${query}` : ""}`} zh={zh} onClick={onClick} />;
}

export default function SiteHeader({ lang, alternatePath }: { lang: string; alternatePath?: string }) {
  const [open, setOpen] = useState(false);
  const header = useRef<HTMLElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const zh = lang === "zh";
  const items = [
    [zh ? "发现" : "Discover", `/${lang}`],
    [zh ? "产品库" : "Products", `/${lang}/tools`],
    [zh ? "专题" : "Collections", `/${lang}/topics`],
    [zh ? "更新动态" : "Updates", `/${lang}/updates`],
  ];
  const languageHref = `/${zh ? "en" : "zh"}${alternatePath ?? pathname.replace(/^\/(en|zh)/, "")}`;
  const active = (href: string) => {
    if (href === `/${lang}`) return pathname === href;
    if (href === `/${lang}/tools` && pathname.startsWith(`/${lang}/categories/`)) return true;
    if (href === `/${lang}/updates` && (pathname === `/${lang}/blog` || pathname.startsWith(`/${lang}/blog/`))) return true;
    return pathname === href || pathname.startsWith(`${href}/`);
  };
  const closeMenu = () => setOpen(false);

  useEffect(() => {
    if (!open) return;
    const closeOutside = (event: PointerEvent) => {
      if (event.target instanceof Node && !header.current?.contains(event.target)) setOpen(false);
    };
    const desktop = window.matchMedia("(min-width: 901px)");
    const closeOnDesktop = (event: MediaQueryListEvent) => { if (event.matches) setOpen(false); };
    document.addEventListener("pointerdown", closeOutside);
    desktop.addEventListener("change", closeOnDesktop);
    return () => {
      document.removeEventListener("pointerdown", closeOutside);
      desktop.removeEventListener("change", closeOnDesktop);
    };
  }, [open]);

  return (
    <header ref={header} className="site-header" onBlur={event => {
      if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget)) closeMenu();
    }} onKeyDown={event => {
      if (event.key === "Escape" && open) { closeMenu(); menuButton.current?.focus(); }
    }}>
      <div className="marketing-container site-header__inner">
        <Link href={`/${lang}`} className="brand-logo" aria-label={zh ? "NavoKit 首页" : "NavoKit home"} onClick={closeMenu}>
          <Image src="/logo.png" alt="NavoKit" width={1672} height={941} sizes="136px" loading="eager" />
        </Link>
        <nav className="site-header__nav" aria-label={zh ? "主导航" : "Main navigation"}>
          {items.map(([label, href]) => <Link key={href} href={href} aria-current={active(href) ? "page" : undefined}>{label}</Link>)}
        </nav>
        <div className="site-header__actions">
          <Suspense fallback={<LanguageOptions href={languageHref} zh={zh} />}><LanguageSwitch href={languageHref} zh={zh} /></Suspense>
          <Link className="site-submit" href={`/${lang}/submit`} aria-current={pathname === `/${lang}/submit` ? "page" : undefined}>{zh ? "提交产品" : "Submit product"}</Link>
        </div>
        <button ref={menuButton} className="menu-button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="mobile-navigation" aria-label={zh ? (open ? "关闭导航菜单" : "打开导航菜单") : (open ? "Close menu" : "Open menu")}><span /><span /></button>
      </div>
      {open && <div id="mobile-navigation" className="mobile-menu">
        <nav className="mobile-menu__links" aria-label={zh ? "移动端导航" : "Mobile navigation"}>
          {items.map(([label, href]) => <Link key={href} href={href} aria-current={active(href) ? "page" : undefined} onClick={closeMenu}>{label}</Link>)}
        </nav>
        <div className="mobile-menu__language"><span>{zh ? "语言" : "Language"}</span><Suspense fallback={<LanguageOptions href={languageHref} zh={zh} onClick={closeMenu} />}><LanguageSwitch href={languageHref} zh={zh} onClick={closeMenu} /></Suspense></div>
        <Link className="site-submit" href={`/${lang}/submit`} aria-current={pathname === `/${lang}/submit` ? "page" : undefined} onClick={closeMenu}>{zh ? "提交产品" : "Submit product"}</Link>
      </div>}
    </header>
  );
}
