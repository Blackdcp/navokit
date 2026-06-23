"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

export default function SiteHeader({ lang }: { lang: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const switchLang = () => {
    const newLang = lang === "zh" ? "en" : "zh";
    router.push(pathname.replace(`/${lang}`, `/${newLang}`));
  };

  const navItems = lang === "zh" ? [
    { label: "工具箱", href: `/${lang}#tools` },
    { label: "博客教程", href: `/${lang}/blog` },
    { label: "关于我们", href: `/${lang}#about` },
  ] : [
    { label: "Tools", href: `/${lang}#tools` },
    { label: "Blog", href: `/${lang}/blog` },
    { label: "About", href: `/${lang}#about` },
  ];

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        height: 108,
        background: "rgba(255,255,255,0.88)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: "1px solid #E5E7EB",
      }}
    >
      <div
        style={{
          maxWidth: 1120,
          margin: "0 auto",
          padding: "0 24px",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo — image only, clean and prominent */}
        <Link
          href={`/${lang}`}
          style={{
            display: "flex",
            alignItems: "center",
            textDecoration: "none",
            flexShrink: 0,
            transition: "transform 0.2s ease",
          }}
          aria-label="NavoKit Home"
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          <img
            src="/logo.png"
            alt="NavoKit"
            style={{
              height: 90,
              width: "auto",
              display: "block",
              objectFit: "contain",
            }}
          />
          <span
            style={{
              position: "absolute",
              width: 1,
              height: 1,
              padding: 0,
              margin: -1,
              overflow: "hidden",
              clip: "rect(0,0,0,0)",
              whiteSpace: "nowrap",
              border: 0,
            }}
          >
            NavoKit
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="site-header-desktop-nav">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              style={{
                color: "#6B7280",
                textDecoration: "none",
                fontSize: 15,
                fontWeight: 500,
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#0B1220")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#6B7280")}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Right */}
        <div className="site-header-desktop-right">
          <button
            onClick={switchLang}
            style={{
              background: "none",
              border: "1px solid #E5E7EB",
              borderRadius: "10px",
              padding: "6px 12px",
              color: "#6B7280",
              fontSize: 13,
              fontWeight: 650,
              cursor: "pointer",
              transition: "border-color 0.2s, color 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#0B1220";
              e.currentTarget.style.color = "#0B1220";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#E5E7EB";
              e.currentTarget.style.color = "#6B7280";
            }}
          >
            {lang === "zh" ? "EN" : "中"}
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="site-header-mobile-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 4,
            display: "none", /* overridden by media query */
          }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#0B1220"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {menuOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div
          className="site-header-mobile-dropdown"
          style={{
            position: "absolute",
            top: 108,
            left: 0,
            width: "100%",
            background: "#fff",
            borderBottom: "1px solid #E5E7EB",
            padding: 20,
            boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
            zIndex: 40,
          }}
        >
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              style={{
                display: "block",
                padding: "12px 0",
                fontSize: 16,
                fontWeight: 500,
                color: "#0B1220",
                textDecoration: "none",
                borderBottom: "1px solid #F3F4F6",
              }}
            >
              {item.label}
            </Link>
          ))}
          <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
            <button
              onClick={() => { switchLang(); setMenuOpen(false); }}
              style={{
                width: "100%",
                padding: "10px 0",
                background: "none",
                border: "1px solid #E5E7EB",
                borderRadius: 12,
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                color: "#6B7280",
              }}
            >
              {lang === "zh" ? "Switch to English" : "切换到中文"}
            </button>
          </div>
        </div>
      )}

      {/* Responsive styles */}
      <style>{`
        .site-header-desktop-nav {
          display: flex;
          align-items: center;
          gap: 32px;
        }
        .site-header-desktop-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        @media (max-width: 768px) {
          .site-header-desktop-nav { display: none !important; }
          .site-header-desktop-right { display: none !important; }
          .site-header-mobile-btn { display: block !important; }
        }
      `}</style>
    </header>
  );
}
