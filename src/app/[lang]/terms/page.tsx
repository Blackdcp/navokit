import type { Metadata } from "next";
import SiteHeader from "../../../components/SiteHeader";
import SiteFooter from "../../../components/SiteFooter";
import { localizedCanonical } from "../../../lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: "en" | "zh" }>;
}): Promise<Metadata> {
  const { lang } = await params;

  return {
    title: lang === "zh" ? "服务条款 | NavoKit" : "Terms of Service | NavoKit",
    description:
      lang === "zh"
        ? "阅读 NavoKit 免费在线工具、AI 生成服务和网站使用相关的服务条款。"
        : "Read the terms for using NavoKit free online tools, AI generation services, and website features.",
    alternates: localizedCanonical(lang, "/terms"),
  };
}

export default async function TermsOfServicePage({ params }: { params: Promise<{ lang: "en" | "zh" }> }) {
  const { lang } = await params;

  return (
    <div className="site-shell">
      <SiteHeader lang={lang} />

      <main className="doc-page">
        <article className="doc-card">
          <h1>{lang === "zh" ? "服务条款" : "Terms of Service"}</h1>

          <div className="prose prose-slate max-w-none">
            {lang === "zh" ? (
              <>
                <p>最后更新时间：2026年6月</p>
                <p>欢迎使用 NavoKit。访问或使用我们的免费工具集合，即表示您同意遵守本服务条款。如果您不同意这些条款，请勿使用我们的网站。</p>

                <h3>1. 服务说明</h3>
                <p>NavoKit 提供一系列基于 Web 的免费生产力工具。我们保留随时修改、暂停或停止服务（全部或部分）的权利，无需事先通知。</p>

                <h3>2. 免责声明</h3>
                <p>我们按原样和可用状态提供所有工具，不提供任何明示或暗示的保证。<strong>由于工具均为免费提供，NavoKit 不对您使用工具所产生的任何直接、间接、附带、特殊或后果性损害承担责任。</strong>这包括但不限于利润损失、数据丢失或其他无形损失。</p>

                <h3>3. 用户责任</h3>
                <ul>
                  <li>您同意不将我们的工具用于任何非法、侵权或违背公共道德的目的。</li>
                  <li>您对通过使用我们工具生成、上传或处理的任何内容（例如文本、图片、文件）全权负责。</li>
                  <li>请勿滥用我们的 API 接口或尝试破坏网站的安全机制。</li>
                </ul>

                <h3>4. 知识产权</h3>
                <p>您通过我们的工具提交的原始内容权利仍归您或相应权利人所有。NavoKit 不会额外授予 AI 输出的商业使用权。您应自行核对第三方 AI 服务的适用条款，并确保输入、输出和使用方式合法且不侵犯第三方权利。</p>

                <h3>5. 适用法律</h3>
                <p>本条款受相关法律管辖。我们保留随时更新本条款的权利，更新后将在本页面生效。</p>

                <h3>6. 联系我们</h3>
                <p>如对本条款有疑问，请联系：</p>
                <p><a href="mailto:admin@navokit.com">admin@navokit.com</a></p>
              </>
            ) : (
              <>
                <p>Last Updated: June 2026</p>
                <p>Welcome to NavoKit. By accessing or using our collection of free tools, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our website.</p>

                <h3>1. Description of Service</h3>
                <p>NavoKit provides a suite of free, web-based productivity tools. We reserve the right to modify, suspend, or discontinue the Service, or any part of it, at any time without notice.</p>

                <h3>2. Disclaimer of Warranties</h3>
                <p>All tools are provided as is and as available, without warranties of any kind, either express or implied. <strong>Because the tools are provided for free, NavoKit shall not be liable for any direct, indirect, incidental, special, or consequential damages resulting from your use of the tools.</strong> This includes, but is not limited to, loss of profits, data loss, or other intangible losses.</p>

                <h3>3. User Responsibilities</h3>
                <ul>
                  <li>You agree not to use our tools for any illegal, infringing, or unethical purposes.</li>
                  <li>You are solely responsible for any content, including text, images, or files, that you generate, upload, or process using our tools.</li>
                  <li>Do not abuse our APIs or attempt to circumvent the security mechanisms of the website.</li>
                </ul>

                <h3>4. Intellectual Property</h3>
                <p>You or the relevant rights holder retain rights in original content you submit. NavoKit does not grant additional commercial rights to AI output. You are responsible for reviewing applicable third-party AI service terms and for ensuring that your input, output, and use are lawful and do not infringe third-party rights.</p>

                <h3>5. Governing Law</h3>
                <p>These terms are governed by applicable laws. We reserve the right to update these terms at any time, which will be effective upon posting on this page.</p>

                <h3>6. Contact Us</h3>
                <p>If you have any questions regarding these terms, please contact:</p>
                <p><a href="mailto:admin@navokit.com">admin@navokit.com</a></p>
              </>
            )}
          </div>
        </article>
      </main>

      <SiteFooter lang={lang} />
    </div>
  );
}
