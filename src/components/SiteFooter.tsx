import Link from "next/link";

export default function SiteFooter({ lang }: { lang: string }) {
  const links = lang === "zh" ? [
    { label: "关于我们", href: `/${lang}#about` },
    { label: "联系我们", href: "mailto:admin@navokit.com" },
    { label: "隐私政策", href: `/${lang}/privacy` },
    { label: "服务条款", href: `/${lang}/terms` },
  ] : [
    { label: "About Us", href: `/${lang}#about` },
    { label: "Contact", href: "mailto:admin@navokit.com" },
    { label: "Privacy Policy", href: `/${lang}/privacy` },
    { label: "Terms of Service", href: `/${lang}/terms` },
  ];

  return (
    <footer
      id="footer"
      style={{
        borderTop: "1px solid #E5E7EB",
        background: "#fff",
        padding: "48px 24px",
      }}
    >
      <div
        className="site-footer-inner"
        style={{
          maxWidth: 1120,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 24,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img
            src="/logo.png"
            alt="NavoKit"
            style={{
              height: 52,
              width: "auto",
              display: "block",
              objectFit: "contain",
              opacity: 0.85,
            }}
          />
          <span style={{ fontSize: 14, color: "#6B7280" }}>
            © {new Date().getFullYear()} All rights reserved.
          </span>
        </div>
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              style={{
                fontSize: 14,
                color: "#6B7280",
                textDecoration: "none",
                fontWeight: 500,
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .site-footer-inner {
            flex-direction: column !important;
            text-align: center;
          }
        }
      `}</style>
    </footer>
  );
}
