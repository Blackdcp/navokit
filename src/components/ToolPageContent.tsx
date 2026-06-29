import Link from "next/link";
import type { ToolContentItem, ToolContentLink } from "../types/toolPageContent";

export default function ToolPageContent({
  lang,
  eyebrow,
  howTitle,
  steps,
  useCases,
  examples,
  limitations,
  privacy,
  faqs,
  related,
  guide,
}: {
  lang: string;
  eyebrow: string;
  howTitle: string;
  steps: ToolContentItem[];
  useCases: ToolContentItem[];
  examples?: ToolContentItem[];
  limitations?: ToolContentItem[];
  privacy: string;
  faqs: ToolContentItem[];
  related: ToolContentLink[];
  guide?: ToolContentLink;
}) {
  const zh = lang === "zh";

  return (
    <div className="tool-content">
      <section className="tool-content__section">
        <span className="eyebrow">{eyebrow}</span>
        <h2>{howTitle}</h2>
        <div className="instruction-grid">
          {steps.map((step, index) => (
            <div key={step.title} className="instruction-card">
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="tool-content__section">
        <span className="eyebrow">{zh ? "适用场景" : "Use cases"}</span>
        <h2>{zh ? "为真实工作设计。" : "Built for real work."}</h2>
        <div className="use-case-grid">
          {useCases.map(item => <div key={item.title}><h3>{item.title}</h3><p>{item.text}</p></div>)}
        </div>
      </section>

      {examples && examples.length > 0 && (
        <section className="tool-content__section">
          <span className="eyebrow">{zh ? "示例" : "Examples"}</span>
          <h2>{zh ? "可以直接借鉴的输入。" : "Inputs you can learn from."}</h2>
          <div className="example-grid">
            {examples.map(item => <div key={item.title}><strong>{item.title}</strong><p>{item.text}</p></div>)}
          </div>
        </section>
      )}

      {limitations && limitations.length > 0 && (
        <section className="tool-content__section">
          <span className="eyebrow">{zh ? "限制" : "Limitations"}</span>
          <h2>{zh ? "开始前需要知道。" : "Know this before you start."}</h2>
          <div className="limit-list">
            {limitations.map(item => <div key={item.title}><h3>{item.title}</h3><p>{item.text}</p></div>)}
          </div>
        </section>
      )}

      <aside className="privacy-note">
        <strong>{zh ? "隐私与处理" : "Privacy & processing"}</strong>
        <p>{privacy}</p>
      </aside>

      <section className="tool-content__section">
        <span className="eyebrow">FAQ</span>
        <h2>{zh ? "常见问题。" : "Questions, answered."}</h2>
        <div className="faq-list">
          {faqs.map(item => <details key={item.title}><summary>{item.title}<span>+</span></summary><p>{item.text}</p></details>)}
        </div>
      </section>

      <section className="tool-content__section">
        <span className="eyebrow">{zh ? "继续工作" : "Keep working"}</span>
        <h2>{zh ? "相关工具与指南。" : "Related tools and guides."}</h2>
        <div className="related-grid">
          {related.map(item => <Link key={item.href} href={item.href}><span>{zh ? "工具" : "Tool"}</span><h3>{item.title}</h3><p>{item.description}</p><b>{zh ? "打开工具 →" : "Try tool →"}</b></Link>)}
          {guide && <Link href={guide.href}><span>{zh ? "指南" : "Guide"}</span><h3>{guide.title}</h3><p>{guide.description}</p><b>{zh ? "阅读指南 →" : "Read guide →"}</b></Link>}
        </div>
      </section>
    </div>
  );
}
