#!/usr/bin/env node
// Acceptance checker for the generated static site. Run it after `npm run generate`:
//
//   npm run check:links [outputDir]
//
// It asserts that the site is correct on its own host: no link into the app is left relative,
// every statement of the site's own URL names the landing host, the route set is unchanged, and
// robots.txt/the sitemap agree with all of that. It also asserts the four safety redirects for
// app paths typed on this host are in the generated _redirects, above any catch-all, and that the
// repo declares them in one place only. Every check runs before the script exits, so one run
// reports every problem; the exit code is non-zero if any check failed.
//
// Plain Node (>= 20), no dependency outside the standard library. The two expected origins are
// this script's own literals on purpose: a checker that imports SITE_URL / APP_BASE_URL from the
// code it verifies proves nothing.

import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

/** the host this site is served from */
const SITE_ORIGIN = 'https://land.t2l.ink'
/** the host the app is served from */
const APP_ORIGIN = 'https://t2l.ink'

/** a root-relative link starting with one of these targets the app, not this site */
const APP_PATH_PREFIXES = ['/login', '/register', '/welcome', '/app', '/api', '/auth-api', '/contact-api']

/** the 21 English routes of README.md's URL map; each also exists under /de/... */
const ROUTES = [
  '/',
  '/agro-solutions',
  '/blog',
  '/blog-articles/enhancing-customer-support-and-efficiency-with-tap2link-a-case-study-of-moerschen',
  '/blog-articles/event-support-at-moerschen-tap2link-enables-a-digital-event-post',
  '/blog-articles/gerchgroup-leveraging-personalised-profiles-for-enhanced-networking',
  '/blog-articles/oceanmata-x-tap2link',
  '/blog-articles/tap2link-in-the-efl-post',
  '/clubs',
  '/contact',
  '/faq',
  '/for-business',
  '/imprint',
  '/pricing',
  '/privacy-policy',
  '/shipping-policy',
  '/terms-of-service',
  '/use-cases/events-use-case',
  '/use-cases/maintenance-use-case',
  '/use-cases/moerschen-use-case',
  '/use-cases/rhein-fire-use-case'
]

/** HTML the build emits that is not one of the routes above */
const NON_ROUTE_HTML = [
  '200.html', // SPA fallback
  '404.html', // the site's own not-found page
  'sitemap.xml/index.html' // @nuxtjs/sitemap's meta-refresh stub to /sitemap_index.xml
]

const repoRoot = resolve(fileURLToPath(new URL('.', import.meta.url)), '..')
const results = []

function pass(criterion, message) {
  results.push({ level: 'PASS', criterion, message, details: [] })
}
function fail(criterion, message, details = []) {
  results.push({ level: 'FAIL', criterion, message, details })
}
function warn(criterion, message, details = []) {
  results.push({ level: 'WARN', criterion, message, details })
}

/** exit with a clear message before any check can run */
function abort(message) {
  console.error(`check-links: ${message}`)
  process.exit(1)
}

// ---------------------------------------------------------------- input directory (criterion 3)

function resolveOutputDir() {
  const argument = process.argv[2]
  if (argument) {
    const dir = resolve(process.cwd(), argument)
    if (!existsSync(dir) || !statSync(dir).isDirectory()) abort(`"${argument}" is not a directory`)
    return dir
  }
  for (const candidate of ['.output/public', 'dist']) {
    const dir = join(repoRoot, candidate)
    if (existsSync(dir) && statSync(dir).isDirectory()) return dir
  }
  abort('no generated output found - looked for .output/public and dist. Run `npm run generate` first.')
}

const outputDir = resolveOutputDir()

function walk(dir) {
  const found = []
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) found.push(...walk(full))
    else found.push(full)
  }
  return found
}

const allFiles = walk(outputDir)
const toPosix = (file) => relative(outputDir, file).split('\\').join('/')
const htmlFiles = allFiles.filter((file) => file.toLowerCase().endsWith('.html')).sort()

if (htmlFiles.length === 0) {
  abort(`no .html files in ${outputDir} - the build produced nothing to check.`)
}

const html = new Map(htmlFiles.map((file) => [toPosix(file), readFileSync(file, 'utf8')]))

// ------------------------------------------------------------------------------- tiny HTML bits

/** every value of an href="..." or action="..." attribute, single or double quoted */
function* attributeLinks(source) {
  const re = /\s(href|action)\s*=\s*(?:"([^"]*)"|'([^']*)')/gi
  let match
  while ((match = re.exec(source)) !== null) {
    yield { attribute: match[1].toLowerCase(), value: match[2] ?? match[3] ?? '' }
  }
}

/** every <link> / <meta> tag as a plain attribute map (attribute order does not matter) */
function* headTags(source) {
  const re = /<(link|meta)\b([^>]*)>/gi
  let match
  while ((match = re.exec(source)) !== null) {
    const attributes = {}
    const attrRe = /([a-zA-Z0-9:_-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g
    let attr
    while ((attr = attrRe.exec(match[2])) !== null) {
      attributes[attr[1].toLowerCase()] = attr[2] ?? attr[3] ?? ''
    }
    yield { tag: match[1].toLowerCase(), attributes }
  }
}

/** origin of an absolute URL, or null when it is not one */
function originOf(value) {
  try {
    return new URL(value).origin
  } catch {
    return null
  }
}

/** '/a/b/' and '/a/b' are the same route; '' is the home page */
function normalisePath(path) {
  if (!path || path === '/') return '/'
  return path.endsWith('/') ? path.slice(0, -1) : path
}

/** the route a generated HTML file serves, or null for the non-route files */
function routeOfFile(file) {
  if (NON_ROUTE_HTML.includes(file)) return null
  if (file === 'index.html') return '/'
  if (file.endsWith('/index.html')) return `/${file.slice(0, -'/index.html'.length)}`
  return null
}

// ------------------------------------------------- criterion 4: no relative link into the app

{
  const offenders = []
  for (const [file, source] of html) {
    for (const { attribute, value } of attributeLinks(source)) {
      if (!value.startsWith('/') || value.startsWith('//')) continue
      const path = value.split(/[?#]/)[0]
      // prefix match on a path boundary: /app/settings is an app path, /apple-touch-icon.png is not
      const hit = APP_PATH_PREFIXES.find((p) => path === p || path.startsWith(`${p}/`))
      if (hit) offenders.push(`${file}: ${attribute}="${value}" (relative app path ${hit})`)
    }
  }
  if (offenders.length === 0) {
    pass(4, `no href/action in ${html.size} HTML files points at a relative app path (${APP_PATH_PREFIXES.join(' ')})`)
  } else {
    fail(4, `${offenders.length} relative link(s) into the app`, offenders)
  }
}

// ------------------------- criterion 5: canonical, og:url and hreflang alternates on the site host

{
  const offenders = []
  let checked = 0
  const missing = []
  for (const [file, source] of html) {
    const isRoute = routeOfFile(file) !== null
    let canonicals = 0
    let ogUrls = 0
    for (const { tag, attributes } of headTags(source)) {
      const candidates = []
      if (tag === 'link' && attributes.rel === 'canonical') {
        canonicals++
        candidates.push(['canonical href', attributes.href])
      }
      if (tag === 'link' && attributes.rel === 'alternate' && attributes.hreflang !== undefined) {
        candidates.push([`hreflang="${attributes.hreflang}" href`, attributes.href])
      }
      if (tag === 'meta' && attributes.property === 'og:url') {
        ogUrls++
        candidates.push(['og:url content', attributes.content])
      }
      for (const [what, value] of candidates) {
        checked++
        if (originOf(value) !== SITE_ORIGIN) offenders.push(`${file}: ${what}="${value}"`)
      }
    }
    if (isRoute && canonicals !== 1) missing.push(`${file}: ${canonicals} canonical tag(s), expected 1`)
    if (isRoute && ogUrls !== 1) missing.push(`${file}: ${ogUrls} og:url tag(s), expected 1`)
  }
  if (offenders.length === 0 && missing.length === 0) {
    pass(5, `all ${checked} canonical / og:url / hreflang URLs are on ${SITE_ORIGIN}`)
  } else {
    fail(5, `${offenders.length} URL(s) off ${SITE_ORIGIN}, ${missing.length} page(s) missing a tag`, [
      ...offenders,
      ...missing
    ])
  }
}

// -------------------------------------------- criterion 6: the old host appears nowhere in the HTML

{
  const offenders = []
  for (const [file, source] of html) {
    const count = source.split('www.t2l.ink').length - 1
    if (count > 0) offenders.push(`${file}: ${count} occurrence(s)`)
  }
  if (offenders.length === 0) pass(6, `"www.t2l.ink" appears in none of the ${html.size} HTML files`)
  else fail(6, `"www.t2l.ink" still present in ${offenders.length} file(s)`, offenders)
}

// ------------------------------------- criterion 7: each page's canonical points at its own route

{
  const offenders = []
  let checked = 0
  for (const [file, source] of html) {
    const route = routeOfFile(file)
    if (route === null) continue
    for (const { tag, attributes } of headTags(source)) {
      if (tag !== 'link' || attributes.rel !== 'canonical') continue
      checked++
      let canonicalPath = null
      try {
        canonicalPath = new URL(attributes.href).pathname
      } catch {
        offenders.push(`${file}: canonical "${attributes.href}" is not an absolute URL`)
        continue
      }
      if (normalisePath(canonicalPath) !== normalisePath(route)) {
        offenders.push(`${file}: canonical path "${canonicalPath}", expected "${route}"`)
      }
    }
  }
  if (offenders.length === 0) pass(7, `all ${checked} canonical URLs match their own route`)
  else fail(7, `${offenders.length} canonical URL(s) point at the wrong route`, offenders)
}

// ------------------------------------------- criterion 8: the generated route set is unchanged

{
  const expected = new Set(NON_ROUTE_HTML)
  for (const route of ROUTES) {
    for (const prefix of ['', '/de']) {
      const path = route === '/' ? prefix || '/' : `${prefix}${route}`
      expected.add(path === '/' ? 'index.html' : `${path.slice(1)}/index.html`)
    }
  }
  const actual = new Set(html.keys())
  const missing = [...expected].filter((file) => !actual.has(file)).sort()
  const extra = [...actual].filter((file) => !expected.has(file)).sort()
  if (missing.length === 0 && extra.length === 0) {
    pass(8, `the build emits exactly the expected ${expected.size} HTML files (${ROUTES.length} EN + ${ROUTES.length} DE routes + ${NON_ROUTE_HTML.length} non-route files)`)
  } else {
    fail(8, `${missing.length} missing, ${extra.length} unexpected HTML file(s)`, [
      ...missing.map((file) => `missing: ${file}`),
      ...extra.map((file) => `unexpected: ${file}`)
    ])
  }
}

// ---------------------------------------------- criterion 9: robots.txt points at the site host

const robotsSitemapUrls = []
{
  const problems = []
  const robotsFiles = [
    ['generated output', join(outputDir, 'robots.txt')],
    ['public/robots.txt', join(repoRoot, 'public', 'robots.txt')]
  ]
  for (const [label, file] of robotsFiles) {
    if (!existsSync(file)) {
      problems.push(`${label}: ${file} does not exist`)
      continue
    }
    const lines = readFileSync(file, 'utf8')
      .split(/\r?\n/)
      .filter((line) => /^\s*sitemap\s*:/i.test(line))
    if (lines.length !== 1) {
      problems.push(`${label}: ${lines.length} "Sitemap:" line(s), expected 1`)
      continue
    }
    const value = lines[0].replace(/^\s*sitemap\s*:\s*/i, '').trim()
    if (originOf(value) !== SITE_ORIGIN) {
      problems.push(`${label}: Sitemap "${value}" is not an absolute URL on ${SITE_ORIGIN}`)
      continue
    }
    robotsSitemapUrls.push({ label, value })
  }
  const values = new Set(robotsSitemapUrls.map((entry) => entry.value))
  if (values.size > 1) problems.push(`the two robots.txt files disagree: ${[...values].join(' vs ')}`)
  if (problems.length === 0) pass(9, `robots.txt names a single sitemap on ${SITE_ORIGIN}: ${[...values][0]}`)
  else fail(9, 'robots.txt Sitemap line is wrong', problems)
}

// ------------------------------------------------------ criterion 10: the sitemap, if there is one

{
  const sitemapFiles = allFiles.filter((file) => {
    const relPath = toPosix(file)
    const name = relPath.split('/').pop()
    if (!name.toLowerCase().endsWith('.xml')) return false
    return name.toLowerCase().startsWith('sitemap') || relPath.includes('__sitemap__/')
  })

  if (sitemapFiles.length === 0) {
    warn(10, 'no sitemap emitted - nothing to check (this does not fail the run)')
  } else {
    const offenders = []
    let locations = 0
    for (const file of sitemapFiles) {
      const source = readFileSync(file, 'utf8')
      const re = /<loc>([^<]*)<\/loc>/gi
      let match
      while ((match = re.exec(source)) !== null) {
        locations++
        const value = match[1].trim()
        if (originOf(value) !== SITE_ORIGIN) offenders.push(`${toPosix(file)}: <loc>${value}</loc>`)
      }
    }
    // the file robots.txt advertises must actually be in the output
    for (const { label, value } of robotsSitemapUrls) {
      const target = join(outputDir, new URL(value).pathname)
      if (!existsSync(target) || !statSync(target).isFile()) {
        offenders.push(`${label}: Sitemap "${value}" names a file that is not in the output`)
      }
    }
    if (offenders.length === 0) {
      pass(10, `${locations} <loc> entries in ${sitemapFiles.length} sitemap file(s) are on ${SITE_ORIGIN}, and robots.txt names a file that exists (${sitemapFiles.map(toPosix).join(', ')})`)
    } else {
      fail(10, `${offenders.length} sitemap problem(s)`, offenders)
    }
  }
}

// ------------------------------------------------- criteria 11 + 12: the app-path safety redirects

/** the four safety redirects, in the order public/_redirects declares them */
const EXPECTED_REDIRECTS = [
  { from: '/login', to: `${APP_ORIGIN}/login`, status: '301' },
  { from: '/register', to: `${APP_ORIGIN}/register`, status: '301' },
  { from: '/welcome', to: `${APP_ORIGIN}/welcome`, status: '301' },
  { from: '/app/*', to: `${APP_ORIGIN}/app/:splat`, status: '301' }
]

/** a rule that answers every remaining path; Nitro appends one, we must never declare one */
const isCatchAll = (rule) => rule.from === '/*' || rule.from === '/**'

/** Netlify _redirects syntax: one rule per line, "from to [status]", # comments and blanks ignored */
function parseRedirects(source) {
  return source
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line !== '' && !line.startsWith('#'))
    .map((line) => {
      const [from, to, status] = line.split(/\s+/)
      return { from, to, status, line }
    })
}

{
  const problems = []
  const generated = join(outputDir, '_redirects')
  if (!existsSync(generated)) {
    problems.push(`${generated} does not exist - the build emitted no _redirects file`)
  } else {
    const rules = parseRedirects(readFileSync(generated, 'utf8'))
    const positions = []
    for (const expected of EXPECTED_REDIRECTS) {
      const index = rules.findIndex((rule) => rule.from === expected.from)
      if (index === -1) {
        problems.push(`no rule for "${expected.from}"`)
        continue
      }
      positions.push({ from: expected.from, index })
      const rule = rules[index]
      if (rule.to !== expected.to || rule.status !== expected.status) {
        problems.push(`"${rule.line}" - expected "${expected.from} ${expected.to} ${expected.status}"`)
      }
    }
    // a catch-all above any of the four would answer first and the redirect would never fire -
    // which is exactly the bug that moved these rules out of netlify.toml
    const firstCatchAll = rules.findIndex(isCatchAll)
    if (firstCatchAll !== -1) {
      for (const { from, index } of positions) {
        if (index > firstCatchAll) {
          problems.push(`"${from}" comes after the catch-all "${rules[firstCatchAll].line}" and can never fire`)
        }
      }
    }
    const order = positions.map((entry) => entry.index)
    if (order.some((index, i) => i > 0 && index < order[i - 1])) {
      problems.push(`the four rules are out of order: ${positions.map((e) => e.from).join(' ')}`)
    }
    if (problems.length === 0) {
      const where = firstCatchAll === -1 ? 'no catch-all in this output' : `above "${rules[firstCatchAll].line}"`
      pass(11, `${toPosix(generated)} declares the ${EXPECTED_REDIRECTS.length} app-path 301s to ${APP_ORIGIN} (${where})`)
    }
  }
  if (problems.length > 0) fail(11, `the app-path safety redirects are wrong in the generated _redirects`, problems)
}

{
  const problems = []
  const repoRedirects = join(repoRoot, 'public', '_redirects')
  if (!existsSync(repoRedirects)) {
    problems.push('public/_redirects does not exist - the four app-path 301s have no home')
  } else {
    for (const rule of parseRedirects(readFileSync(repoRedirects, 'utf8')).filter(isCatchAll)) {
      problems.push(`public/_redirects declares a catch-all: "${rule.line}" - it would suppress the site's own 404 page`)
    }
  }
  const netlifyToml = join(repoRoot, 'netlify.toml')
  if (!existsSync(netlifyToml)) {
    problems.push('netlify.toml does not exist')
  } else if (/^\s*\[\[redirects\]\]/m.test(readFileSync(netlifyToml, 'utf8'))) {
    problems.push('netlify.toml declares a [[redirects]] table - it can never fire, and two mechanisms disagree')
  }
  if (problems.length === 0) {
    pass(12, 'one redirect mechanism: public/_redirects carries the rules and no catch-all, netlify.toml declares none')
  } else {
    fail(12, 'the repo declares its redirects in the wrong place', problems)
  }
}

// ----------------------------------------------------------------------------------- the report

console.log(`check-links: ${html.size} HTML files in ${outputDir}`)
console.log(`             site host ${SITE_ORIGIN}, app host ${APP_ORIGIN}`)
console.log('')
for (const { level, criterion, message, details } of results) {
  console.log(`${level}: [criterion ${criterion}] ${message}`)
  for (const detail of details) console.log(`        ${detail}`)
}
const failed = results.filter((result) => result.level === 'FAIL')
console.log('')
console.log(
  `${failed.length === 0 ? 'OK' : 'FAILED'}: ${results.filter((r) => r.level === 'PASS').length} passed, ` +
    `${failed.length} failed, ${results.filter((r) => r.level === 'WARN').length} warning(s)`
)
process.exit(failed.length === 0 ? 0 : 1)
