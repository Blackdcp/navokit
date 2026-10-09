import HomePage from "./ClientPage";
import { SITE_URL } from "../../lib/site";
import { ORGANIZATION_ID, pageIdentity, safeJsonLd } from "../../lib/schema";

export default async function Page({ params }: { params: Promise<{ lang: "en" | "zh" }> }) {
  const { lang } = await params;
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage", ...pageIdentity(`${SITE_URL}/${lang}`, lang),
    name: lang === "zh" ? "NavoKit · 发现新锐科技产品" : "NavoKit · Discover emerging technology products",
    about: { "@id": ORGANIZATION_ID },
  };
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(schema) }} /><HomePage lang={lang} /></>;
}
