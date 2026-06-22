import { getDictionary } from '../../lib/dictionaries'
import { getProducts } from '../../lib/api'
import ClientPage from './ClientPage'

export default async function Page({
  params,
}: {
  params: Promise<{ lang: 'en' | 'zh' }>
}) {
  const resolvedParams = await params
  const dict = await getDictionary(resolvedParams.lang)
  const products = getProducts(resolvedParams.lang)
  
  return <ClientPage dict={dict} products={products} lang={resolvedParams.lang} />
}
