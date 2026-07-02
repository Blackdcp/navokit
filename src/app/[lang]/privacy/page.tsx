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
                <p>最后更新时间：2026年7月</p>
                <p>欢迎使用 NavoKit。我们非常重视您的隐私，并尽量减少不必要的数据收集。本隐私政策解释了我们如何处理免费在线工具、AI 生成服务、日志、分析和广告相关的数据。</p>

                <h3>1. 信息收集</h3>
                <p>我们提供免费的在线工具，且<strong>不要求注册账号</strong>。我们尽可能少地收集信息：</p>
                <ul>
                  <li><strong>本地处理：</strong>部分工具（如 Markdown 转图片）完全在您的浏览器前端运行，您输入的内容<strong>不会</strong>被上传到我们的服务器。</li>
                  <li><strong>AI 视频生成：</strong>当您使用 AI 视频生成器时，提示词、画面比例和时长设置会由外部 AI 视频服务处理以完成生成。请勿输入敏感或机密信息。</li>
                  <li><strong>日志与分析：</strong>托管服务、Vercel Analytics 和 Google Analytics 可能处理 IP 地址、浏览器类型、页面访问和基础使用数据，用于安全、故障排查和汇总统计。</li>
                </ul>

                <h3>2. 我们如何使用信息</h3>
                <p>由于我们极少收集个人信息，我们的主要数据处理仅限于：</p>
                <ul>
                  <li>提供和维护我们的工具服务。</li>
                  <li>防止滥用和保障系统安全。</li>
                  <li>理解页面和工具的聚合使用情况，以改进产品体验。</li>
                  <li>在未来展示清晰标记的广告，以支持免费工具的持续运营。</li>
                </ul>

                <h3>3. 数据共享</h3>
                <p>我们不会出售或出租您的个人信息。AI 视频任务会通过 NavoKit 发送给外部 AI 视频服务处理。NavoKit 不提供用户账号、提示词历史或视频历史记录，但托管日志、缓存以及相关服务的数据保留政策仍可能适用。</p>

                <h3>4. 广告与 Cookie</h3>
                <p>NavoKit 可能会使用 Google AdSense 或其他第三方广告服务。第三方供应商（包括 Google）可能会使用 Cookie，根据用户过去访问 NavoKit 或其他网站的情况投放广告。</p>
                <p>Google 使用广告 Cookie，使 Google 及其合作伙伴能够根据用户访问本站和/或互联网上其他网站的情况投放广告。用户可以访问 <a href="https://adssettings.google.com/" target="_blank" rel="noreferrer">Google Ads Settings</a> 退出个性化广告，也可以通过 <a href="https://www.aboutads.info/choices/" target="_blank" rel="noreferrer">AboutAds choices</a> 了解部分第三方供应商的退出选项。</p>
                <p>你还可以阅读 Google 关于合作网站数据使用方式的说明：<a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noreferrer">How Google uses information from sites or apps that use our services</a>。</p>

                <h3>5. Cookie 与浏览器控制</h3>
                <p>网站可能使用必要的存储机制保存界面首选项，并使用 Vercel Analytics 和 Google Analytics 进行聚合统计。你可以通过浏览器设置阻止或删除 Cookie；但部分设置可能影响网站功能、统计或广告展示。</p>

                <h3>6. 联系我们</h3>
                <p>如果您对本隐私政策有任何疑问，请通过以下邮箱联系我们：</p>
                <p><a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a></p>
              </>
            ) : (
              <>
                <p>Last Updated: July 2026</p>
                <p>Welcome to NavoKit. We take your privacy seriously and try to avoid collecting data that is not needed. This Privacy Policy explains how we handle data related to free online tools, AI generation services, logs, analytics, and advertising.</p>

                <h3>1. Information Collection</h3>
                <p>We provide free online tools and <strong>do not require account registration</strong>. We collect as little information as possible:</p>
                <ul>
                  <li><strong>Local Processing:</strong> Some tools, such as Markdown to Image, run entirely in your browser. Your input is <strong>never</strong> uploaded to our servers.</li>
                  <li><strong>AI Video Generation:</strong> When you use the AI video generator, your prompt, format, and duration settings are processed by an external AI video service to create the video. Do not enter sensitive or confidential information.</li>
                  <li><strong>Logs and Analytics:</strong> Our hosting services, Vercel Analytics, and Google Analytics may process IP address, browser type, page visits, and basic usage data for security, troubleshooting, and aggregate analytics.</li>
                </ul>

                <h3>2. How We Use Information</h3>
                <p>Because we collect minimal personal information, our data processing is limited to:</p>
                <ul>
                  <li>Providing and maintaining our tool services.</li>
                  <li>Preventing abuse and ensuring system security.</li>
                  <li>Understanding aggregate page and tool usage so we can improve the product experience.</li>
                  <li>Showing clearly labeled advertising in the future to support the continued operation of free tools.</li>
                </ul>

                <h3>3. Data Sharing</h3>
                <p>We do not sell or rent your personal information. AI video tasks pass through NavoKit to an external AI video service for processing. NavoKit does not provide user accounts, prompt history, or video history, but hosting logs, caches, and related service retention policies may still apply.</p>

                <h3>4. Advertising and Cookies</h3>
                <p>NavoKit may use Google AdSense or other third-party advertising services. Third-party vendors, including Google, may use cookies to serve ads based on a user&apos;s prior visits to NavoKit or other websites.</p>
                <p>Google&apos;s use of advertising cookies enables Google and its partners to serve ads based on visits to this site and/or other sites on the Internet. Users may opt out of personalized advertising by visiting <a href="https://adssettings.google.com/" target="_blank" rel="noreferrer">Google Ads Settings</a>. You may also visit <a href="https://www.aboutads.info/choices/" target="_blank" rel="noreferrer">AboutAds choices</a> to learn about opt-out options for some third-party vendors.</p>
                <p>You can also read Google&apos;s explanation of data use on partner sites: <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noreferrer">How Google uses information from sites or apps that use our services</a>.</p>

                <h3>5. Cookies and Browser Controls</h3>
                <p>The site may use necessary storage for interface preferences, Vercel Analytics, and Google Analytics for aggregate statistics. You can block or delete cookies through your browser settings, though some choices may affect site functionality, measurement, or advertising.</p>

                <h3>6. Contact Us</h3>
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
