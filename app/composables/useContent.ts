// Markdown content loader for the three content collections (use cases, blog articles, legal
// pages). Files are content/<collection>/<slug>.<locale>.md; a page asks for its locale and falls
// back to English when no German file exists. Images in markdown get width/height (from
// app/data/image-sizes.json, generated together with public/images) and lazy loading.
import MarkdownIt from 'markdown-it'
import imageSizes from '~/data/image-sizes.json'

const sizes = imageSizes as Record<string, [number, number]>

const md = new MarkdownIt({ html: true, linkify: true, breaks: false })

// <img> with intrinsic size + lazy loading (all content images sit below the fold)
const defaultImage = md.renderer.rules.image!
md.renderer.rules.image = (tokens, idx, options, env, self) => {
  const token = tokens[idx]!
  const src = token.attrGet('src') ?? ''
  const size = sizes[src]
  if (size) {
    token.attrSet('width', String(size[0]))
    token.attrSet('height', String(size[1]))
  }
  token.attrSet('loading', 'lazy')
  token.attrSet('decoding', 'async')
  return defaultImage(tokens, idx, options, env, self)
}

// external links open in a new tab
const defaultLinkOpen = md.renderer.rules.link_open ?? ((tokens, idx, options, _env, self) => self.renderToken(tokens, idx, options))
md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
  const href = tokens[idx]!.attrGet('href') ?? ''
  if (/^https?:\/\//.test(href)) {
    tokens[idx]!.attrSet('target', '_blank')
    tokens[idx]!.attrSet('rel', 'noopener')
  }
  return defaultLinkOpen(tokens, idx, options, env, self)
}

function parseFrontmatter(raw: string): { data: Record<string, string>; content: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  if (!match) return { data: {}, content: raw }
  const [, frontmatter, content] = match
  const data: Record<string, string> = {}
  for (const line of frontmatter!.split(/\r?\n/)) {
    const fieldMatch = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/)
    if (!fieldMatch) continue
    const [, key, rawValue] = fieldMatch
    let value = rawValue!.trim()
    if (value.startsWith('"') && value.endsWith('"')) {
      value = JSON.parse(value)
    } else if (value.startsWith("'") && value.endsWith("'")) {
      value = value.slice(1, -1)
    }
    data[key!] = value
  }
  return { data, content: content! }
}

export interface ContentPage {
  slug: string
  locale: string
  title: string
  seoTitle: string
  description: string
  html: string
  data: Record<string, string>
}

export interface ArticleContent extends ContentPage {
  date: string
  image: string
  imageAlt: string
}

export interface UseCaseContent extends ContentPage {
  titleLine1: string
  titleLine2: string
  subtitle: string
  hero: string
  heroAlt: string
  iconLight: string
  iconDark: string
  /** eyebrow labels (<!-- eyebrow: ... --> comments) in document order, used by the page template */
  eyebrows: string[]
}

const useCaseFiles = import.meta.glob('../../content/use-cases/*.md', { eager: true, query: '?raw', import: 'default' }) as Record<string, string>
const blogFiles = import.meta.glob('../../content/blog/*.md', { eager: true, query: '?raw', import: 'default' }) as Record<string, string>
const legalFiles = import.meta.glob('../../content/legal/*.md', { eager: true, query: '?raw', import: 'default' }) as Record<string, string>

function parseName(path: string): { slug: string; locale: string } {
  const file = path.split('/').pop()!.replace(/\.md$/, '')
  const m = file.match(/^(.*)\.([a-z]{2})$/)
  return m ? { slug: m[1]!, locale: m[2]! } : { slug: file, locale: 'en' }
}

function build(files: Record<string, string>): ContentPage[] {
  return Object.entries(files).map(([path, raw]) => {
    const { slug, locale } = parseName(path)
    const { data, content } = parseFrontmatter(raw)
    return {
      slug,
      locale,
      title: data.title ?? slug,
      seoTitle: data.seoTitle ?? data.title ?? slug,
      description: data.description ?? '',
      html: md.render(content),
      data
    }
  })
}

const useCases = build(useCaseFiles).map((p): UseCaseContent => ({
  ...p,
  titleLine1: p.data.titleLine1 ?? p.title,
  titleLine2: p.data.titleLine2 ?? '',
  subtitle: p.data.subtitle ?? '',
  hero: p.data.hero ?? '',
  heroAlt: p.data.heroAlt ?? '',
  iconLight: p.data.iconLight ?? '',
  iconDark: p.data.iconDark ?? '',
  eyebrows: [...p.html.matchAll(/<!-- eyebrow: (.*?) -->/g)].map((m) => m[1]!)
}))

const articles = build(blogFiles)
  .map((p): ArticleContent => ({
    ...p,
    date: p.data.date ?? '',
    image: p.data.image ?? '',
    imageAlt: p.data.imageAlt ?? p.title
  }))
  .sort((a, b) => b.date.localeCompare(a.date))

const legalPages = build(legalFiles)

function pick<T extends ContentPage>(list: T[], slug: string, locale: string): T | undefined {
  return list.find((p) => p.slug === slug && p.locale === locale) ?? list.find((p) => p.slug === slug && p.locale === 'en')
}

/** the four use-case slugs in the order the old site listed them */
export const USE_CASE_SLUGS = ['moerschen-use-case', 'maintenance-use-case', 'events-use-case', 'rhein-fire-use-case'] as const

export function useUseCase(slug: string, locale: string): UseCaseContent | undefined {
  return pick(useCases, slug, locale)
}

export function useArticles(locale: string): ArticleContent[] {
  const slugs = [...new Set(articles.map((a) => a.slug))]
  return slugs.map((s) => pick(articles, s, locale)!).sort((a, b) => b.date.localeCompare(a.date))
}

export function useArticle(slug: string, locale: string): ArticleContent | undefined {
  return pick(articles, slug, locale)
}

export function useLegalPage(slug: string, locale: string): ContentPage | undefined {
  return pick(legalPages, slug, locale)
}

/** width/height for a public image path, for explicit <img> dimensions */
export function imageSize(src: string): { width?: number; height?: number } {
  const s = sizes[src]
  return s ? { width: s[0], height: s[1] } : {}
}
