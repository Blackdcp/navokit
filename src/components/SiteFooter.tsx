import Image from "next/image";
import Link from "next/link";

export default function SiteFooter({ lang }: { lang: string }) {
  const zh = lang === "zh";
  const groups = [
    { title: zh ? "探索" : "Explore", links: [[zh ? "产品库" : "Products", `/${lang}/tools`], [zh ? "专题" : "Collections", `/${lang}/topics`], [zh ? "更新动态" : "Updates", `/${lang}/updates`], [zh ? "文章" : "Articles", `/${lang}/blog`]] },
    { title: "NavoKit", links: [[zh ? "关于我们" : "About", `/${lang}/about`], [zh ? "收录与编辑说明" : "Editorial policy", `/${lang}/editorial-policy`], [zh ? "提交产品" : "Submit a product", `/${lang}/submit`], [zh ? "联系我们" : "Contact", `/${lang}/contact`]] },
    { title: zh ? "条款" : "Legal", links: [[zh ? "隐私政策" : "Privacy Policy", `/${lang}/privacy`], [zh ? "服务条款" : "Terms of Service", `/${lang}/terms`]] },
  ];
  return (
    <footer className="site-footer">
      <div className="marketing-container footer-grid">
        <div className="footer-brand">
          <Link href={`/${lang}`} className="brand-logo" aria-label={zh ? "NavoKit 首页" : "NavoKit home"}>
            <Image src="/logo-inverse.png" alt="NavoKit" width={1672} height={941} sizes="150px" />
          </Link>
          <p>{zh ? "导航帮你发现，工具帮你实现。" : "Navigation to discover. Tools to make it happen."}</p>
        </div>
        {groups.map(group => (
          <div key={group.title} className="footer-group">
            <strong>{group.title}</strong>
            {group.links.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
          </div>
        ))}
      </div>
      <div className="marketing-container footer-bottom">
        <span>© {new Date().getFullYear()} NavoKit</span>
        <span>{zh ? "发现新锐产品，探索新的可能。" : "New products. Different possibilities."}</span>
      </div>
    </footer>
  );
}
