import Image from "next/image";
import Link from "next/link";

export default function SiteFooter({ lang }: { lang: string }) {
  const groups = lang === "zh"
    ? [
        { title: "工具", links: [["AI 视频生成器", `/${lang}/tools/free-ai-video-generator`], ["Markdown 转图片", `/${lang}/tools/markdown-to-image`], ["AI 社交媒体文案", `/${lang}/tools/ai-social-booster`]] },
        { title: "资源", links: [["实用指南", `/${lang}/blog`], ["关于 NavoKit", `/${lang}#about`], ["联系我们", `/${lang}/contact`]] },
        { title: "法律", links: [["隐私政策", `/${lang}/privacy`], ["服务条款", `/${lang}/terms`]] },
      ]
    : [
        { title: "Tools", links: [["AI Video Generator", `/${lang}/tools/free-ai-video-generator`], ["Markdown to Image", `/${lang}/tools/markdown-to-image`], ["Social Post Generator", `/${lang}/tools/ai-social-booster`]] },
        { title: "Resources", links: [["Practical guides", `/${lang}/blog`], ["About NavoKit", `/${lang}#about`], ["Contact", `/${lang}/contact`]] },
        { title: "Legal", links: [["Privacy Policy", `/${lang}/privacy`], ["Terms of Service", `/${lang}/terms`]] },
      ];

  return (
    <footer className="site-footer">
      <div className="marketing-container footer-grid">
        <div className="footer-brand">
          <Image src="/logo-inverse.png" alt="NavoKit" width={1672} height={941} />
          <p>{lang === "zh" ? "小工具，快一点完成工作。" : "Small tools. Faster work."}</p>
        </div>
        {groups.map(group => (
          <div key={group.title} className="footer-group">
            <strong>{group.title}</strong>
            {group.links.map(([label, href]) => <Link key={label} href={href}>{label}</Link>)}
          </div>
        ))}
      </div>
      <div className="marketing-container footer-bottom">
        <span>© {new Date().getFullYear()} NavoKit</span>
        <span>{lang === "zh" ? "给创作者、开发者和运营人的免费 AI 工具箱。" : "Free AI tools for creators, developers, and marketers."}</span>
      </div>
    </footer>
  );
}
