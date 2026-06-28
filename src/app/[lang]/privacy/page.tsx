import SiteHeader from "../../../components/SiteHeader";
import SiteFooter from "../../../components/SiteFooter";

export default function PrivacyPolicyPage({ params: { lang } }: { params: { lang: string } }) {
  return (
    <div style={{ minHeight: "100vh", background: "#F8FAFC", color: "#0B1220" }}>
      <SiteHeader lang={lang} />
      
      <main style={{ maxWidth: 800, margin: "0 auto", padding: "80px 24px" }}>
        <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 24, padding: "48px" }}>
          <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 32 }}>
            {lang === "zh" ? "隐私政策" : "Privacy Policy"}
          </h1>
          
          <div className="prose prose-slate max-w-none">
            {lang === "zh" ? (
              <>
                <p>最后更新时间：2026年6月</p>
                <p>欢迎使用 NavoKit（"我们"）。我们非常重视您的隐私，并致力于保护您的个人数据。本隐私政策解释了我们如何收集、使用和共享您的信息。</p>
                
                <h3>1. 信息收集</h3>
                <p>我们提供完全免费的工具，且<strong>不要求注册账号</strong>。我们尽可能少地收集信息：</p>
                <ul>
                  <li><strong>本地处理：</strong> 部分工具（如 Markdown 转图片）完全在您的浏览器前端运行，您输入的内容<strong>不会</strong>被上传到我们的服务器。</li>
                  <li><strong>日志信息：</strong> 当您访问网站时，我们会自动收集某些标准日志信息（如 IP 地址、浏览器类型），这仅用于维护网站安全和基本统计分析。</li>
                </ul>

                <h3>2. 我们如何使用信息</h3>
                <p>由于我们极少收集个人信息，我们的主要数据处理仅限于：</p>
                <ul>
                  <li>提供和维护我们的工具服务。</li>
                  <li>防止滥用和保障系统安全。</li>
                </ul>

                <h3>3. 数据共享</h3>
                <p>我们不会向任何第三方出售、出租或交易您的个人信息。对于需要在服务器进行处理的工具（如 AI 生成类工具），我们仅在提供服务所必需的最小范围内处理数据，生成完毕后不会长期存储您的输入内容。</p>

                <h3>4. Cookie 的使用</h3>
                <p>我们使用基础的 Cookie 仅用于保存您的界面首选项（如语言设置）。我们不使用侵入式的第三方广告追踪 Cookie。</p>

                <h3>5. 联系我们</h3>
                <p>如果您对本隐私政策有任何疑问，请通过以下邮箱联系我们：</p>
                <p><a href="mailto:admin@navokit.com">admin@navokit.com</a></p>
              </>
            ) : (
              <>
                <p>Last Updated: June 2026</p>
                <p>Welcome to NavoKit ("we", "us", or "our"). We take your privacy seriously and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, and share your information.</p>
                
                <h3>1. Information Collection</h3>
                <p>We provide completely free tools and <strong>do not require account registration</strong>. We collect as little information as possible:</p>
                <ul>
                  <li><strong>Local Processing:</strong> Some tools, such as Markdown to Image, run entirely in your browser. Your input is <strong>never</strong> uploaded to our servers.</li>
                  <li><strong>Log Information:</strong> When you visit our website, we automatically collect certain standard log information (like IP address and browser type) strictly for security and basic analytics purposes.</li>
                </ul>

                <h3>2. How We Use Information</h3>
                <p>Because we collect minimal personal information, our data processing is limited to:</p>
                <ul>
                  <li>Providing and maintaining our tool services.</li>
                  <li>Preventing abuse and ensuring system security.</li>
                </ul>

                <h3>3. Data Sharing</h3>
                <p>We do not sell, rent, or trade your personal information to third parties. For tools that require server-side processing (such as AI generation tools), we process data only to the minimum extent necessary to provide the service and do not retain your input content long-term after generation.</p>

                <h3>4. Use of Cookies</h3>
                <p>We use basic cookies strictly to save your interface preferences (such as language settings). We do not use intrusive third-party advertising tracking cookies.</p>

                <h3>5. Contact Us</h3>
                <p>If you have any questions about this Privacy Policy, please contact us at:</p>
                <p><a href="mailto:admin@navokit.com">admin@navokit.com</a></p>
              </>
            )}
          </div>
        </div>
      </main>

      <SiteFooter lang={lang} />
    </div>
  );
}
