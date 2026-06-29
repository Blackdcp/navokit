import { getDictionary } from '../../lib/dictionaries'
import { getTools } from '../../lib/api'
import { getBlogPosts } from '../../lib/blog'
import { getWorkflowRails } from '../../lib/workflows'
import ClientPage from './ClientPage'
import { SITE_URL } from '../../lib/site'

export default async function Page({
  params,
}: {
  params: Promise<{ lang: 'en' | 'zh' }>
}) {
  const resolvedParams = await params
  const dict = await getDictionary(resolvedParams.lang)
  const tools = getTools(resolvedParams.lang)
  const posts = getBlogPosts(resolvedParams.lang).slice(0, 3)
  const workflowRails = getWorkflowRails(resolvedParams.lang)
  
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: "NavoKit",
        url: SITE_URL,
        logo: `${SITE_URL}/logo.png`,
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: "NavoKit",
        url: SITE_URL,
        publisher: { "@id": `${SITE_URL}/#organization` },
        inLanguage: resolvedParams.lang === "zh" ? "zh-CN" : "en",
      },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
      <ClientPage dict={dict} tools={tools} posts={posts} workflowRails={workflowRails} lang={resolvedParams.lang} />
    </>
  )
}
