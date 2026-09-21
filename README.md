# tap2link marketing site

Self-hosted replacement for the tap2link marketing site, previously built on Webflow. Nuxt 4 static
site (`nuxt generate`), Tailwind CSS 4, `@nuxtjs/i18n` (EN default, DE under `/de/...`),
`@nuxtjs/sitemap`, Netlify Forms for the contact form. No third-party scripts; Google Fonts
(Inter + Nunito Sans) is the only external resource.

## Hosts

The marketing site and the app live on two different hosts:

| Host | What | Declared in |
| --- | --- | --- |
| `https://land.t2l.ink` | this site (Netlify) | `SITE_URL` in `nuxt.config.ts` - feeds the sitemap, the canonical/hreflang tags and `og:url`; repeated as a literal in `public/robots.txt` (a static file) and as `usePageSeo`'s fallback |
| `https://t2l.ink` | the app: login, profiles, tag links | `APP_BASE_URL` in `app/data/links.ts` |

Every link into the app must be **absolute** - a relative `/login` or `/welcome` would stay on the
landing host and 404. Build them with `appUrl('/welcome')` from `app/data/links.ts`; never write the
host again anywhere else. In-site links keep using `localePath()`/`<NuxtLink>` and stay relative.
`public/_redirects` carries four 301s (`/login`, `/register`, `/welcome`, `/app/*`) as a safety net
for app paths typed on the landing host; they are not a catch-all, so this site's own files and its
404 page keep precedence. They cannot live in `netlify.toml`: `nuxt generate` writes its own
`_redirects` into the publish directory ending in a `/* /404.html 404` catch-all, and Netlify reads
`_redirects` before `netlify.toml` and takes the first match - so a redirect declared in
`netlify.toml` is never reached. Nitro keeps a hand-written `public/_redirects` and appends its
rules after it, which is why the four rules sit first; never add a `/*` line to that file.
`www.t2l.ink` and the root of `t2l.ink` redirect to `land.t2l.ink` on the load balancer, outside
this repo.

Built 2026-09-06 from an extraction of all 21 live pages (EN) and their Weglot-served German
versions. The structure mirrors `C:\code\machinemaster\retailer-landing-page`.

## Setup

```bash
npm install          # Node 24 (see .nvmrc); package-lock.json pins a working resolution -
                     # a fresh resolve without the lockfile currently fails on a vite peer conflict
npm run dev          # http://localhost:3000
npm run generate     # static output in .output/public (`dist` is a symlink to it, which is what
                     # Netlify publishes, see netlify.toml)
npm run preview
npm run check:links  # after `npm run generate`: asserts the built site is correct on its own host
```

`npm run check:links` (`scripts/check-links.mjs`, zero dependencies) walks the generated HTML and
fails if any `href`/`action` points at a relative app path, if a canonical / `og:url` / hreflang URL
is off `land.t2l.ink`, if `www.t2l.ink` survives anywhere, if a canonical does not match its own
route, if the set of generated pages changed, or if `robots.txt` and the emitted sitemap disagree.
It also fails if the generated `_redirects` no longer carries the four app-path 301s in their
required form or lets a catch-all precede them, and if the repo declares redirects twice
(a `/*` line in `public/_redirects`, or a `[[redirects]]` table in `netlify.toml`).
It reads `.output/public` (or `dist`, or a directory given as the first argument) and prints one
PASS/FAIL line per check.

**Worktrees:** the build fails if `node_modules` is a symlink into another checkout - Nuxt's build
directory lives in `node_modules/.cache/nuxt`, and prerendering then dies with *"Only URLs with a
scheme in: file, data, and node are supported ... Received protocol 'c:'"*. Give each worktree its
own `node_modules` (`npm ci`).

Branches: `main` is production (Netlify), `dev` is the base for work; one `fix/` or `feature/`
branch per task, merged on GitHub.

## Structure

```
nuxt.config.ts            SITE_URL (this site's own host), i18n (en default / de prefixed), sitemap,
                          titleTemplate, icons, fonts
netlify.toml              build `npm run generate`, publish `dist`, Node 24, security headers
                          (no redirects - see public/_redirects)
scripts/check-links.mjs   `npm run check:links` - host/route/redirect checks on the generated HTML
app/
  app.vue                 html lang + canonical/hreflang per locale (useLocaleHead)
  assets/css/main.css     Tailwind 4 @theme tokens (brand blues, navy, ink, lime, page, greys; Inter + Nunito Sans),
                          .btn-* pills, .card, .eyebrow, .prose-t2l
  assets/logo.svg         the tap2link wordmark (currentColor), inlined by <LogoMark>
  composables/usePageSeo.ts   title / description / OG / Twitter / canonical per page
  composables/useContent.ts   markdown loader for content/** (per-locale files, EN fallback, img width/height + lazy)
  data/links.ts           every external URL (login, stores, Amazon shop, demo calendar, socials);
                          APP_BASE_URL + appUrl() build every link into the app
  data/image-sizes.json   intrinsic sizes of public/images/** (generated; used for width/height attrs)
  components/             AppHeader, AppFooter, HomeHero, AppStoreCards, PartnerLogos, FeatureCards,
                          HomeUseCases, ShopCards, CtaBanner, PricingTable, DesignWorkshop, FaqAccordion,
                          ContactForm, ArticleCard, PageHero, LegalPage, LogoMark, AppBadges
  pages/                  one file per live URL (see below)
content/
  use-cases/<slug>.<en|de>.md    the 4 use cases (frontmatter: title lines, subtitle, hero, icons, SEO)
  blog/<slug>.<en|de>.md         the 5 blog articles (date, cover image, SEO)
  legal/<slug>.<en|de>.md        imprint, privacy-policy, terms-of-service, shipping-policy
i18n/locales/en.json, de.json   every UI string and all product-page copy (home, pricing, agro, business, clubs, faq, contact)
public/
  images/**               all assets copied from the Webflow CDN with clean names (hero/, icons/, partners/,
                          badges/, shop/, pricing/, agro/, business/, clubs/, use-cases/, blog/, og-image.jpg)
  favicon.png, apple-touch-icon.png, robots.txt
  _redirects              the four 301s for app paths typed on the landing host (Netlify syntax,
                          shipped verbatim; never add a `/*` catch-all here)
```

### URL map (identical to the live site)

| Path | Source |
| --- | --- |
| `/` | `pages/index.vue` + i18n `home.*` |
| `/use-cases/moerschen-use-case`, `/use-cases/maintenance-use-case`, `/use-cases/events-use-case`, `/use-cases/rhein-fire-use-case` | `pages/use-cases/[slug].vue` + `content/use-cases/` |
| `/agro-solutions`, `/for-business`, `/clubs`, `/pricing`, `/faq`, `/contact` | one page each + i18n |
| `/blog` | `pages/blog/index.vue` |
| `/blog-articles/<slug>` (5 articles) | `pages/blog-articles/[slug].vue` + `content/blog/` |
| `/imprint`, `/privacy-policy`, `/terms-of-service`, `/shipping-policy` | `<LegalPage>` + `content/legal/` |

Every path also exists under `/de/...`. The sitemap (`/sitemap_index.xml`) lists both locales.

## i18n notes

- Default locale `en` (no prefix, `en-US`), German under `/de` (`de-DE`), strategy
  `prefix_except_default`, no browser-language detection. The language switch is in the header.
- **German copy source:** the live site serves a German version through Weglot
  (`https://www.t2l.ink/de/...`, `lang="de"`, server-rendered). All 21 German pages were fetched and
  the texts extracted block by block in parallel with the English ones, so the German copy in
  `de.json` and in the `*.de.md` files is the **live site's Weglot copy, verbatim** (incl. its
  quirks, see "Decisions to confirm"). The only German strings written by hand are the few UI
  labels the old site did not have (form field names, "Show less", menu aria labels, the partner
  logo strip heading) and the handful of CTA headlines the old site split into one word per
  element (Weglot translated those word by word, e.g. "Freischalten / die / Macht / von /
  Konnektivität"; they were re-joined into proper sentences).
- Blog articles, use cases and legal pages exist in **both** languages (markdown per locale).
  A page falls back to the English file if a German one is missing.
- Titles and meta descriptions are the live site's, per locale.

## Contact form

Netlify form `contact` (fields `firstName`, `lastName`, `email`, `company`, `message`, honeypot
`bot-field`), same pattern as the template: static `data-netlify` markup, `$fetch('/')` form-encoded
on submit. The live Webflow form had different fields (Name, Email, a Topic select, Message, two
consent checkboxes) - see below.

## Decisions to confirm

1. **Shop links are dead.** `https://shop.t2l.ink/` (and `/products/...`) no longer resolves. All
   "Buy now" and "Visit shop" buttons (home page "Shop" section, 5 card products at €12,90) now
   link to `/contact` labelled "Contact us". The **"Shop" item in the header and footer** links to
   the Amazon listing the live desktop nav used
   (`https://www.amazon.de/Digitale-Visitenkarte-Abyss-Blue-QR-Code/dp/B0BNL4L1H4/...`, in
   `app/data/links.ts`); the live mobile nav and footer still pointed at the dead shop domain.
   Decide: keep the Amazon link, drop the Shop nav item, or drop the whole Shop section.
2. **"Log in" goes to `https://t2l.ink/welcome`** - that is exactly what the live header links to
   (there is no `/login` link anywhere in the live HTML). "Get started" on the pricing page also
   goes to `/welcome`.
3. **No `og:image` on the live site.** The Webflow site shipped no Open Graph tags at all.
   `public/images/og-image.jpg` (1200x630) was made from the hero cover photo; replace with a
   branded image if wanted.
4. **Weglot German has inconsistencies** that were kept verbatim: it mixes "Sie" and "du" (e.g.
   the clubs page, the home features, the FAQ), and has some literal translations ("Ereignisse"
   for Events, "Eigenschaften" for Features, "Wärme-Club" for Heat Club, "Nahtloser Zugang zum
   Ventilator" for "Seamless Fan Access" in the Rhein Fire use case, "Annullierungspolitik").
   A proofread of `i18n/locales/de.json` and `content/**/*.de.md` is recommended; the English
   copy was also kept as is, including its typos ("scanniing", "Summimg up", "Moershen").
5. **Contact form fields** follow the brief (first name, last name, email, company, message)
   rather than the live form (name, email, topic select with 6 options, message, privacy +
   terms checkboxes). Netlify form notifications need to be set up in the Netlify UI.
6. **Not reproduced 1:1:**
   - the Lottie animation layered over the home hero (`Cover-new (4).json`) - replaced by the
     static cover photo;
   - the Splide carousels (partner logos, the three profile-preview strips on /for-business) -
     rendered as a static wrapping logo grid and three static image strips;
   - the pricing page's "Features / €11.99 / year / Button" fragment that sat between the plan
     cards and the table in the live HTML looked like leftover Webflow markup and was dropped;
   - the FAQ "Learn more -> #" and use-case hero "Learn more -> #" dead anchors now scroll to the
     overview section;
   - the Rhein Fire wallpaper background referenced in the old CSS returned 403 from the CDN and
     is not used.
7. **Third-party scripts removed on purpose:** Weglot, HubSpot (`js-eu1.hs-scripts.com/25304988.js`),
   jQuery/Webflow runtime, Splide, Google Analytics (the privacy policy text still describes
   Google Analytics and cookies - it is the live text, but it no longer matches what the site
   does; legal review recommended).
8. **Company details in the legal texts differ between pages** (HRB 90623 in the imprint vs. HRB
   95550 in the terms; return addresses Breite Str. 27 / Donaustraße 36b / Leopoldstr. 44). Kept as
   on the live site.
9. Two use-case pages had no in-page images on the live site beyond the hero (maintenance); the
   Moerschen "confirm product" screenshot's alt text on the live site is German - kept.

## Assets

`public/images/**` was produced by a one-off copy script (mapping Webflow CDN file names to clean
names) together with `app/data/image-sizes.json`; the mapping is documented by the folder names.
Two icons (`favicon.png` 32x32, `apple-touch-icon.png` 256x256) are the live site's
`shortcut icon` / `apple-touch-icon`.
