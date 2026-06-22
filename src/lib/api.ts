import fs from 'fs'
import path from 'path'
import { Product } from '../types/product'

export function getProducts(lang: 'zh' | 'en'): Product[] {
  const dirPath = path.join(process.cwd(), 'src', 'content', 'products', lang)
  
  if (!fs.existsSync(dirPath)) {
    // Fallback to zh if en doesn't exist yet
    if (lang === 'en') {
      return getProducts('zh')
    }
    return []
  }

  const fileNames = fs.readdirSync(dirPath)
  const products = fileNames
    .filter(name => name.endsWith('.json'))
    .map(fileName => {
      const filePath = path.join(dirPath, fileName)
      const fileContents = fs.readFileSync(filePath, 'utf8')
      return JSON.parse(fileContents) as Product
    })

  return products
}

export function getProductBySlug(lang: 'zh' | 'en', slug: string): Product | null {
  const products = getProducts(lang)
  return products.find(p => p.id === slug) || null
}
