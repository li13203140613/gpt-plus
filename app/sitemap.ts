import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.gpt-plus.ai'

  const pages = [
    '/',
    '/chatgpt-plus-kaitong',
    '/chatgpt-plus-shengji',
    '/chatgpt-plus-dingyue',
    '/chatgpt-plus-goumai',
    '/chatgpt-plus-kaitong-fuwu',
    '/chatgpt-plus-dingyue-fuwu',
    '/chatgpt-plus-zhifu-xiezhu',
    '/chatgpt-plus-dai-kaitong',
    '/chatgpt-plus-dai-dingyue',
    '/chatgpt-plus-chongzhi',
  ]

  return pages.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date('2026-03-07'),
    changeFrequency: path === '/' ? 'daily' as const : 'weekly' as const,
    priority: path === '/' ? 1 : 0.8,
  }))
}
