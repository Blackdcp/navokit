import { getDictionary } from '../../../../lib/dictionaries'
import ClientPpt2PdfPage from './ClientPage'
import { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: 'en' | 'zh' }>
}): Promise<Metadata> {
  const resolvedParams = await params
  const lang = resolvedParams.lang
  const dict = await getDictionary(lang)
  
  const title = `${dict.ppt2pdf.title} | NavoKit`
  const description = lang === 'en' 
    ? 'Convert PPT/PPTX to PDF online for free while perfectly preserving layout, fonts, and graphics.' 
    : '在线免费 PPT 转 PDF，基于原生底层文档引擎，完美保留所有原始排版和字体。'

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      images: [
        {
          url: "/images/tools/ppt-to-pdf.png",
          width: 1200,
          height: 630,
          alt: title,
        }
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/images/tools/ppt-to-pdf.png"],
    }
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ lang: 'en' | 'zh' }>
}) {
  const resolvedParams = await params
  const dict = await getDictionary(resolvedParams.lang)
  
  return <ClientPpt2PdfPage dict={dict} lang={resolvedParams.lang} />
}
