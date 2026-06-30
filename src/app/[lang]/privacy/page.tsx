import type { Metadata } from "next";
import SiteHeader from "../../../components/SiteHeader";
import SiteFooter from "../../../components/SiteFooter";
import { localizedCanonical, SUPPORT_EMAIL } from "../../../lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: "en" | "zh" }>;
}): Promise<Metadata> {
  const { lang } = await params;

  return {
    title: lang === "zh" ? "隐私政策 | NavoKit" : "Privacy Policy | NavoKit",
    description:
      lang === "zh"
        ? "了解 NavoKit 如何处理免费在线工具、AI 生成服务、日志和分析相关的数据。"
        : "Learn how NavoKit handles data for free online tools, AI generation services, logs, and analytics.",
    alternates: localizedCanonical(lang, "/privacy"),
  };
}

export default async function PrivacyPolicyPage({ params }: { params: Promise<{ lang: "en" | "zh" }> }) {
  const { lang } = await params;

  return (
    <div className="site-shell">
      <SiteHeader lang={lang} />

      <main className="doc-page">
        <article className="doc-card">
          <h1>{lang === "zh" ? "隐私政策" : "Privacy Policy"}</h1>

          <div className="prose prose-slate max-w-none">
            {lang === "zh" ? (
              <>
                <p>最后更新时间：2026年6月</p>
                <p>欢迎使用 NavoKit。我们非常重视您的隐私，并致力于保护您的个人数据。本隐私政策解释了我们如何收集、使用和共享您的信息。</p>

                <h3>1. 信息收集</h3>
                <p>我们提供免费的在线工具，且<strong>不要求注册账号</strong>。我们尽可能少地收集信息：</p>
                <ul>
                  <li><strong>本地处理：</strong>部分工具（如 Markdown 转图片）完全在您的浏览器前端运行，您输入的内容<strong>不会</strong>被上传到我们的服务器。</li>
                  <li><strong>AI 视频生成：</strong>当您使用 AI 视频生成器时，提示词、画面比例和时长设置会由外部 AI 视频服务处理以完成生成。请勿输入敏感或机密信息。</li>
                  <li><strong>日志与分析：</strong>托管服务和 Vercel Analytics 可能处理 IP 地址、浏览器类型、页面访问和基础使用数据，用于安全、故障排查和汇总统计。</li>
                </ul>

                <h3>2. 我们如何使用信息</h3>
                <p>由于我们极少收集个人信息，我们的主要数据处理仅限于：</p>
                <ul>
                  <li>提供和维护我们的工具服务。</li>
                  <li>防止滥用和保障系统安全。</li>
                </ul>

                <h3>3. 数据共享</h3>
                <p>我们不会出售或出租您的个人信息。AI 视频任务会通过 NavoKit 发送给外部 AI 视频服务处理。NavoKit 不提供提示词或视频历史记录，但托管日志、缓存以及相关服务的数据保留政策仍可能适用。</p>

                <h3>4. Cookie 的使用</h3>
                <p>网站可能使用必要的存储机制保存界面首选项，并使用 Vercel Analytics 进行聚合统计。我们目前不使用广告定向 Cookie。</p>

                <h3>5. 联系我们</h3>
                <p>如果您对本隐私政策有任何疑问，请通过以下邮箱联系我们：</p>
                <p><a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a></p>
              </>
            ) : (
              <>
                <p>Last Updated: June 2026</p>
                <p>Welcome to NavoKit. We take your privacy seriously and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, and share your information.</p>

                <h3>1. Information Collection</h3>
                <p>We provide free online tools and <strong>do not require account registration</strong>. We collect as little information as possible:</p>
                <ul>
                  <li><strong>Local Processing:</strong> Some tools, such as Markdown to Image, run entirely in your browser. Your input is <strong>never</strong> uploaded to our servers.</li>
                  <li><strong>AI Video Generation:</strong> When you use the AI video generator, your prompt, format, and duration settings are processed by an external AI video service to create the video. Do not enter sensitive or confidential information.</li>
                  <li><strong>Logs and Analytics:</strong> Our hosting services and Vercel Analytics may process IP address, browser type, page visits, and basic usage data for security, troubleshooting, and aggregate analytics.</li>
                </ul>

                <h3>2. How We Use Information</h3>
                <p>Because we collect minimal personal information, our data processing is limited to:</p>
                <ul>
                  <li>Providing and maintaining our tool services.</li>
                  <li>Preventing abuse and ensuring system security.</li>
                </ul>

                <h3>3. Data Sharing</h3>
                <p>We do not sell or rent your personal information. AI video tasks pass through NavoKit to an external AI video service for processing. NavoKit does not provide prompt or video history, but hosting logs, caches, and related service retention policies may still apply.</p>

                <h3>4. Use of Cookies</h3>
                <p>The site may use necessary storage for interface preferences and Vercel Analytics for aggregate statistics. We do not currently use advertising-targeting cookies.</p>

                <h3>5. Contact Us</h3>
                <p>If you have any questions about this Privacy Policy, please contact us at:</p>
                <p><a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a></p>
              </>
            )}
          </div>
        </article>
      </main>

      <SiteFooter lang={lang} />
    </div>
  );
}
