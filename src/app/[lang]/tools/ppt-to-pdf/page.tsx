import { getDictionary } from '../../../../lib/dictionaries'
import ClientPpt2PdfPage from './ClientPage'

export default async function Page({
  params,
}: {
  params: Promise<{ lang: 'en' | 'zh' }>
}) {
  const resolvedParams = await params
  const dict = await getDictionary(resolvedParams.lang)
  
  return <ClientPpt2PdfPage dict={dict} lang={resolvedParams.lang} />
}
