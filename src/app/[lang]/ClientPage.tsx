"use client";

import type { Product } from "../../types/product";
import { categories } from "../../lib/categories";
import Link from "next/link";
import SiteHeader from "../../components/SiteHeader";
import SiteFooter from "../../components/SiteFooter";

/* ─── SVG icon components for the hero grid ─── */
const IconFile = ({ color = "#2563EB" }: { color?: string }) => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
  </svg>
);
const IconCode = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0B1220" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
);
const IconImage = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
);
const IconHeadset = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0B1220" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
    <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
  </svg>
);
const IconCamera = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const heroIcons = [
  <IconFile key="f1" />,
  <IconCode key="c1" />,
  <IconImage key="i1" />,
  <IconFile key="f2" color="#2563EB" />,
  <IconHeadset key="h1" />,
  <IconCamera key="ca1" />,
];

/* ─── Small icon for tool cards (varies by product title) ─── */
function CardIcon({ title }: { title: string }) {
  if (title.includes("视频") || title.includes("Video"))
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="23 7 16 12 23 17 23 7" />
        <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
      </svg>
    );
  if (title.includes("PDF") || title.includes("PPT"))
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
      </svg>
    );
  if (title.includes("文案") || title.includes("Text") || title.includes("社媒"))
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0B1220" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="4 7 4 4 20 4 20 7" />
        <line x1="9" y1="20" x2="15" y2="20" />
        <line x1="12" y1="4" x2="12" y2="20" />
      </svg>
    );
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  );
}

/* ─── Shared card style ─── */
const cardStyle: React.CSSProperties = {
  background: "#fff",
  border: "1px solid #E5E7EB",
  borderRadius: 20,
  boxShadow: "0 1px 2px rgba(11,18,32,0.04)",
  textDecoration: "none",
  color: "inherit",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  transition: "border-color 0.2s, box-shadow 0.2s, transform 0.2s",
  position: "relative",
};

/* ─── Main component ─── */
export default function HomePage({
  dict,
  products,
  lang,
}: {
  dict: any;
  products: Product[];
  lang: string;
}) {
  const productsByCategory: Record<string, Product[]> = {};
  products.forEach((p) => {
    if (!productsByCategory[p.categoryId]) productsByCategory[p.categoryId] = [];
    productsByCategory[p.categoryId].push(p);
  });

  return (
    <div style={{ minHeight: "100vh", background: "#F8FAFC", color: "#0B1220" }}>
      <SiteHeader lang={lang} />

      {/* ══════ HERO ══════ */}
      <section
        className="hero-section"
        style={{
          maxWidth: 800,
          margin: "0 auto",
          padding: "80px 24px 60px",
          textAlign: "center",
        }}
      >
        <div style={{ display: "flex", justifyContent: "center", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
          <span style={{ padding: "6px 14px", background: "#F8FAFC", border: "1px solid #E5E7EB", color: "#0B1220", borderRadius: 20, fontSize: 13, fontWeight: 600 }}>
            {lang === "zh" ? "100% 免费" : "100% Free"}
          </span>
          <span style={{ padding: "6px 14px", background: "#F8FAFC", border: "1px solid #E5E7EB", color: "#0B1220", borderRadius: 20, fontSize: 13, fontWeight: 600 }}>
            {lang === "zh" ? "无需注册" : "No Signup"}
          </span>
          <span style={{ padding: "6px 14px", background: "#F8FAFC", border: "1px solid #E5E7EB", color: "#0B1220", borderRadius: 20, fontSize: 13, fontWeight: 600 }}>
            {lang === "zh" ? "隐私优先" : "Privacy First"}
          </span>
        </div>

        <h1
          style={{
            fontSize: "clamp(36px, 5vw, 56px)",
            lineHeight: 1.15,
            letterSpacing: "-0.04em",
            fontWeight: 780,
            color: "#0B1220",
            margin: "0 0 16px",
          }}
        >
          {lang === "zh" ? "免费 AI 小工具箱" : "Free AI Tools for Faster Everyday Work"}
        </h1>
        <p
          style={{
            fontSize: 18,
            lineHeight: 1.6,
            color: "#6B7280",
            margin: "0 auto 32px",
            maxWidth: 640,
          }}
        >
          {lang === "zh"
            ? "文档、内容、社媒工作，快一点完成。NavoKit 提供一组无需注册、打开即用的免费工具：PPT 转 PDF、ChatGPT 长图导出、社媒文案生成、AI 视频生成等。"
            : "Convert files, export ChatGPT answers, generate social posts, and create AI videos — no signup required."}
        </p>
      </section>

      {/* ══════ TOOLS ══════ */}
      <section id="tools" style={{ maxWidth: 1120, margin: "0 auto", padding: "0 24px 64px" }}>
        {categories.map((category) => {
          const items = productsByCategory[category.id];
          if (!items || items.length === 0) return null;
          return (
            <div key={category.id} style={{ marginBottom: 56 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: "#0B1220", marginBottom: 24, letterSpacing: "-0.01em" }}>
                {lang === "zh" ? category.nameZh : category.nameEn}
              </h2>
              <div
                className="tools-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                  gap: 24,
                }}
              >
                {items.map((product) => {
                  const toolUrl = product.linkUrl 
                    ? product.linkUrl.replace(/^\/(zh|en)\//, `/${lang}/`) 
                    : `/${lang}/tools/${product.id}`;

                  return (
                    <Link
                      key={product.id}
                      href={toolUrl}
                      style={cardStyle}
                      className="tool-card group"
                    >
                      {/* Card body */}
                      <div style={{ padding: "32px 28px", flex: 1, display: "flex", flexDirection: "column" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                          <div
                            style={{
                              width: 48,
                              height: 48,
                              borderRadius: 14,
                              background: "#F8FAFC",
                              border: "1px solid #E5E7EB",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <CardIcon title={product.title} />
                          </div>
                          {product.isHot && (
                            <span style={{ fontSize: 11, fontWeight: 700, color: "#6B7280", border: "1px solid #E5E7EB", background: "#F8FAFC", padding: "2px 8px", borderRadius: 10, letterSpacing: "0.05em" }}>
                              HOT
                            </span>
                          )}
                        </div>

                        <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0B1220", margin: "0 0 8px", lineHeight: 1.3 }}>
                          {product.title}
                        </h3>
                        <p style={{ fontSize: 14, color: "#6B7280", margin: 0, lineHeight: 1.6, flex: 1 }}>
                          {product.subtitle.replace(/<[^>]*>?/gm, "")}
                        </p>
                      </div>

                      {/* Footer hover indicator */}
                      <div
                        className="tool-card-footer"
                        style={{
                          padding: "16px 28px",
                          borderTop: "1px solid #E5E7EB",
                          background: "#F8FAFC",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          transition: "background 0.2s",
                        }}
                      >
                        <img
                          src="/logo.png"
                          alt="NavoKit"
                          style={{
                            height: 36,
                            width: "auto",
                            display: "block",
                            objectFit: "contain",
                            opacity: 0.6,
                            transition: "opacity 0.2s"
                          }}
                          className="card-logo"
                        />
                        <span className="try-now-text" style={{ fontSize: 14, fontWeight: 650, color: "#2563EB", display: "flex", alignItems: "center", gap: 4, opacity: 0, transform: "translateX(-10px)", transition: "all 0.2s" }}>
                          {lang === "zh" ? "立即使用" : "Try Now"}
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </section>

      {/* ══════ ABOUT / BRAND SECTION ══════ */}
      <section id="about" style={{ background: "#0B1220", color: "#fff", padding: "80px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 36px)", fontWeight: 700, marginBottom: 20, letterSpacing: "-0.02em" }}>
            {lang === "zh" ? "小工具，快一点完成工作。" : "Small tools. Faster work."}
          </h2>
          <p style={{ fontSize: 18, lineHeight: 1.6, color: "#9CA3AF", marginBottom: 32, maxWidth: 600, margin: "0 auto 32px" }}>
            {lang === "zh" 
              ? "NavoKit 小工具箱，是给创作者、开发者和运营人的免费 AI 工具箱。我们坚信好工具不该有门槛——无需注册、无需付费、隐私优先。"
              : "NavoKit is a free AI tools hub for creators, developers, and marketers. We believe great tools should have no barriers — no signup, no payment, privacy-first."}
          </p>
          <a
            href="mailto:chengziai2026@163.com"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "12px 24px",
              background: "#1F2937",
              color: "#fff",
              borderRadius: 12,
              fontWeight: 600,
              fontSize: 15,
              textDecoration: "none",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#374151")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#1F2937")}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            {lang === "zh" ? "联系我们" : "Contact Us"}
          </a>
        </div>
      </section>

      <SiteFooter lang={lang} />

      {/* ══════ RESPONSIVE ══════ */}
      <style>{`
        html {
          scroll-behavior: smooth;
        }

        .tool-card:hover {
          border-color: #CBD5E1 !important;
          box-shadow: 0 12px 32px rgba(11,18,32,0.06), 0 4px 12px rgba(11,18,32,0.04) !important;
          transform: translateY(-4px);
        }

        .tool-card:hover .tool-card-footer {
          background: #EFF6FF !important;
          border-top-color: #DBEAFE !important;
        }
        
        .tool-card:hover .card-logo {
          opacity: 1 !important;
        }

        .tool-card:hover .try-now-text {
          opacity: 1 !important;
          transform: translateX(0) !important;
        }

        @media (max-width: 860px) {
          .hero-section { padding: 60px 20px 40px !important; }
          .hero-section h1 { font-size: clamp(32px, 8vw, 42px) !important; }
          .hero-section p { font-size: 16px !important; }
        }

        @media (max-width: 640px) {
          .tools-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}