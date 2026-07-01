import Link from "next/link";
import Image from "next/image";
import type { ToolContentItem, ToolContentLink, ToolExample, ToolExampleType, ToolFact } from "../types/toolPageContent";

function ExampleOutput({
  example,
  exampleType,
}: {
  example: ToolExample;
  exampleType?: ToolExampleType;
}) {
  if (example.image) {
    return (
      <figure className="proof-image">
        <Image
          src={example.image.src}
          alt={example.image.alt}
          width={example.image.width}
          height={example.image.height}
          sizes="(max-width: 768px) 100vw, 520px"
        />
      </figure>
    );
  }

  if (example.video) {
    return (
      <figure className="proof-video-asset">
        <video
          controls
          muted
          playsInline
          preload="metadata"
          width={example.video.width}
          height={example.video.height}
          src={example.video.src}
        >
          <a href={example.video.src}>{example.video.title}</a>
        </video>
      </figure>
    );
  }

  const output = example.output ?? "";

  if (exampleType === "markdown") {
    return (
      <div className="proof-markdown-card">
        <pre>{output}</pre>
        <div className="proof-watermark">
          <span>Made with</span>
          <Image src="/logo-watermark.png" alt="NavoKit" width={82} height={21} />
        </div>
      </div>
    );
  }

  if (exampleType === "social") {
    return (
      <div className="proof-social-draft">
        <pre>{output}</pre>
      </div>
    );
  }

  if (exampleType === "video") {
    return (
      <div className="proof-video-frame">
        <div>
          <span>▶</span>
          <strong>Result checklist</strong>
        </div>
        <pre>{output}</pre>
      </div>
    );
  }

  return <pre>{output}</pre>;
}

export default function ToolPageContent({
  lang,
  eyebrow,
  howTitle,
  facts,
  steps,
  useCases,
  exampleType,
  examples,
  limitations,
  privacy,
  faqs,
  related,
  guide,
  guides,
}: {
  lang: string;
  eyebrow: string;
  howTitle: string;
  facts?: ToolFact[];
  steps: ToolContentItem[];
  useCases: ToolContentItem[];
  exampleType?: ToolExampleType;
  examples?: ToolExample[];
  limitations?: ToolContentItem[];
  privacy: string;
  faqs: ToolContentItem[];
  related: ToolContentLink[];
  guide?: ToolContentLink;
  guides?: ToolContentLink[];
}) {
  const zh = lang === "zh";
  const guideLinks = guides && guides.length > 0 ? guides : guide ? [guide] : [];
  const exampleHeading = exampleType === "markdown"
    ? (zh ? "查看输入内容，以及按导出样式生成的 PNG 示例。" : "See the input and actual PNG-style output examples.")
    : (zh ? "查看输入内容、输出示例和使用前需要知道的限制。" : "See the input, output examples, and what to check before using the tool.");

  return (
    <div className="tool-content">
      {facts && facts.length > 0 && (
        <section className="tool-content__section tool-facts" aria-label={zh ? "工具摘要" : "Tool summary"}>
          <span className="eyebrow">{zh ? "工具摘要" : "Tool summary"}</span>
          <h2>{zh ? "这个工具能完成什么。" : "What this tool does."}</h2>
          <dl>
            {facts.map(item => (
              <div key={item.label}>
                <dt>{item.label}</dt>
                <dd>{item.value}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

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
          <span className="eyebrow">{zh ? "真实示例" : "Product examples"}</span>
          <h2>{exampleHeading}</h2>
          <div className="example-proof-grid" aria-label={zh ? "产品示例" : "Product examples"}>
            {examples.map((item, index) => (
              <article key={item.title} className={`example-proof-card example-proof-card--${exampleType ?? "default"}`}>
                <span className="example-grid__index">{String(index + 1).padStart(2, "0")}</span>
                <strong>{item.title}</strong>
                <div className="example-proof-card__split">
                  <div className="example-proof-card__input">
                    <small>{item.inputLabel ?? (zh ? "输入" : "Input")}</small>
                    <pre>{item.input}</pre>
                  </div>
                  <div className="example-proof-card__output">
                    <small>{item.outputLabel ?? (zh ? "输出" : "Output")}</small>
                    <ExampleOutput example={item} exampleType={exampleType} />
                  </div>
                </div>
                {item.note && <p className="example-proof-card__note">{item.note}</p>}
              </article>
            ))}
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
          {guideLinks.map(item => <Link key={item.href} href={item.href}><span>{zh ? "指南" : "Guide"}</span><h3>{item.title}</h3><p>{item.description}</p><b>{zh ? "阅读指南 →" : "Read guide →"}</b></Link>)}
        </div>
      </section>
    </div>
  );
}
