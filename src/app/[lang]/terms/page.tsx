import SiteHeader from "../../../components/SiteHeader";
import SiteFooter from "../../../components/SiteFooter";

export default function TermsOfServicePage({ params: { lang } }: { params: { lang: string } }) {
  return (
    <div style={{ minHeight: "100vh", background: "#F8FAFC", color: "#0B1220" }}>
      <SiteHeader lang={lang} />
      
      <main style={{ maxWidth: 800, margin: "0 auto", padding: "80px 24px" }}>
        <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 24, padding: "48px" }}>
          <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 32 }}>
            {lang === "zh" ? "服务条款" : "Terms of Service"}
          </h1>
          
          <div className="prose prose-slate max-w-none">
            {lang === "zh" ? (
              <>
                <p>最后更新时间：2026年6月</p>
                <p>欢迎使用 NavoKit。访问或使用我们的免费工具集合，即表示您同意遵守本服务条款。如果您不同意这些条款，请勿使用我们的网站。</p>

                <h3>1. 服务说明</h3>
                <p>NavoKit 提供一系列基于 Web 的免费生产力工具（包括但不限于 AI 视频生成、社媒文案生成、PPT转PDF等）。我们保留随时修改、暂停或停止服务（全部或部分）的权利，无需事先通知。</p>

                <h3>2. 免责声明</h3>
                <p>我们按"原样"和"可用"提供所有工具，不提供任何明示或暗示的保证。<strong>由于工具均为免费提供，NavoKit 不对您使用工具所产生的任何直接、间接、附带、特殊或后果性损害承担责任。</strong> 这包括但不限于利润损失、数据丢失或其他无形损失。</p>

                <h3>3. 用户责任</h3>
                <ul>
                  <li>您同意不将我们的工具用于任何非法、侵权或违背公共道德的目的。</li>
                  <li>您对通过使用我们工具生成、上传或处理的任何内容（例如视频、文本、文件）全权负责。</li>
                  <li>请勿滥用我们的 API 接口或尝试破坏网站的安全机制。</li>
                </ul>

                <h3>4. 知识产权</h3>
                <p>您通过我们的工具上传的原始内容知识产权仍归您所有。我们不对您生成的内容主张所有权，但由于 AI 生成特性的限制，您应自行确保生成内容的合法性和版权问题。</p>

                <h3>5. 适用法律</h3>
                <p>本条款受相关法律管辖。我们保留随时更新本条款的权利，更新后将在本页面生效。</p>

                <h3>6. 联系我们</h3>
                <p>如对本条款有疑问，请联系：</p>
                <p><a href="mailto:chengziai2026@163.com">chengziai2026@163.com</a></p>
              </>
            ) : (
              <>
                <p>Last Updated: June 2026</p>
                <p>Welcome to NavoKit. By accessing or using our collection of free tools, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our website.</p>

                <h3>1. Description of Service</h3>
                <p>NavoKit provides a suite of free, web-based productivity tools (including but not limited to AI video generation, social media copywriting, and PPT to PDF conversion). We reserve the right to modify, suspend, or discontinue the Service (or any part thereof) at any time without notice.</p>

                <h3>2. Disclaimer of Warranties</h3>
                <p>All tools are provided on an "AS IS" and "AS AVAILABLE" basis without warranties of any kind, either express or implied. <strong>Because the tools are provided for free, NavoKit shall not be liable for any direct, indirect, incidental, special, or consequential damages resulting from your use of the tools.</strong> This includes, but is not limited to, loss of profits, data loss, or other intangible losses.</p>

                <h3>3. User Responsibilities</h3>
                <ul>
                  <li>You agree not to use our tools for any illegal, infringing, or unethical purposes.</li>
                  <li>You are solely responsible for any content (e.g., videos, text, files) that you generate, upload, or process using our tools.</li>
                  <li>Do not abuse our APIs or attempt to circumvent the security mechanisms of the website.</li>
                </ul>

                <h3>4. Intellectual Property</h3>
                <p>You retain the intellectual property rights to any original content you upload. We claim no ownership over the content you generate. However, due to the nature of AI generation, you are responsible for ensuring the legality and copyright status of the generated outputs.</p>

                <h3>5. Governing Law</h3>
                <p>These terms are governed by applicable laws. We reserve the right to update these terms at any time, which will be effective upon posting on this page.</p>

                <h3>6. Contact Us</h3>
                <p>If you have any questions regarding these terms, please contact:</p>
                <p><a href="mailto:chengziai2026@163.com">chengziai2026@163.com</a></p>
              </>
            )}
          </div>
        </div>
      </main>

      <SiteFooter lang={lang} />
    </div>
  );
}
