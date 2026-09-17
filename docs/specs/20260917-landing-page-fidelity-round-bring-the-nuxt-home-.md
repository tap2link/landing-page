---
task: 20260917-landing-page-fidelity-round-bring-the-nuxt-home-
company: tap2link
status: ready
size: L
branch: feature/landing-page-fidelity-round-bring-the-nuxt-home-
base: dev
design: none
---

# Bring the Nuxt home page closer to the Webflow original: fluid scale, full-bleed hero, section fidelity

## Goal

The new Nuxt marketing site (`t2l-landing.netlify.app`) renders the same content, order, copy,
colours and components as the live Webflow site (`www.t2l.ink`), but reads like a zoomed-out
version of it: the container is capped at ~1216px where the original spans ~1296px, type is
roughly 70-75% of the original's size, and the hero is a rounded card below a grey nav strip
instead of a full-bleed photo running under a floating nav. This task closes that gap on the
**home page in both locales** (`/` and `/de/`) plus the shared header, footer, container and type
scale, so that at 1440 the two pages read at the same scale. It is a fidelity pass, not a
redesign: no copy changes, no new pages, and the existing component structure is adjusted, never
rewritten.

`design: none` — the live original plus `design/reference/2026-09-17-webflow-vs-nuxt/` in
`C:\code\tap2link` are the handoff; nothing new has to be drafted by the Designer, and
`design/STATUS.md` records no handoff for this repo.

## Assumptions

- The live `https://www.t2l.ink/` is reachable from the executing environment in a real browser and
  can be measured with DevTools; the front desk did exactly this on 2026-09-17. If it is not, see
  "Stop conditions".
- The target numbers in "Approach → measured targets" are the **front desk's** measurements of the
  original, not mine — I did not open a browser. They are marked `unverified`. The live original
  wins over this table: where a re-measured value differs by more than 10% from the number here,
  the measured value is the target and the report records both.
- **Decision at gate 1 — the Shop section on the home page.** The original home goes use cases →
  blue CTA → footer; the new one inserts `ShopCards` between them. Default for this task: keep it
  and restyle it to the corrected scale. Removing it is one line in `app/pages/index.vue`.
- **Decision at gate 1 — body font.** The original's body text is Inter throughout; this repo sets
  body to Nunito Sans. `README.md` and the `main.css` header comment do record Nunito Sans, but as
  a token *lifted from the old Webflow CSS*, not as a design decision — and the browser
  contradicts the lift. Default for this task: body becomes Inter, Nunito Sans is dropped
  entirely.
- **Decision at gate 1 — self-hosting the fonts.** The constraint "self-hosted fonts only" is read
  as applying to this task, so the runtime Google Fonts `<link>` in `nuxt.config.ts` goes away and
  Inter ships as committed `woff2` files under `public/fonts/`. This needs no npm dependency (Inter
  is SIL OFL, redistribution allowed). If the constraint only meant "add no *new* external font
  request", say so and the Google Fonts link stays (with Nunito Sans removed from it).
- The header's scroll behaviour on the original home page is `unverified` (the reference images are
  single scroll positions). Default: on the home page the header floats over the photo and is not
  sticky; on every other page it stays exactly as today. The Implementer confirms against the live
  original and matches it.
- The two portrait images in the original's blue CTA banner are Tap2Link's own (team photos). This
  is `unverified` — see "Stop conditions".
- "Within ~10%" in the acceptance means: the new computed value is within ±10% of the original's
  computed value for the same element at the same viewport width.
- The footer *does* already render column headings (`footer.solutions` / `useCases` / `other` /
  `socials` exist in `en.json` and are rendered as `<h3>` in `AppFooter.vue`); finding 11's "no
  column headings" is a misreading of a downscaled strip. The real footer gap is scale and vertical
  padding, and that is what this spec fixes.
- No automated test suite exists in this repo and none is added here (a runner would be a new
  dependency). Verification is `npm run generate`, a browser measurement pass and a link check —
  spelled out under "Verification and evidence".
- Nothing outside the landing worktree is committed; screenshots are written into the design
  reference folder but not committed there.

Correct me at gate 1, otherwise I proceed with these.

## Context found

- `app/assets/css/main.css`: the single source of design tokens — Tailwind 4 `@theme` block
  (brand blues, navy, ink, lime, `--color-page: #fafafa`, greys, `--font-sans: Inter`,
  `--font-body: Nunito Sans`), the `body { @apply bg-page font-body ... }` base rule,
  `.container-page` (`max-w-7xl px-5 sm:px-8` → 1216px of content at 1440), `.btn-*`, `.card`,
  `.eyebrow`, `.link-arrow`. It does **not** override Tailwind's `--text-*` scale, so every
  component uses stock `text-sm … text-6xl` — fixed px, which is exactly why the page does not grow
  with the viewport.
- `nuxt.config.ts`: `app.head.link` loads Inter + Nunito Sans from `fonts.googleapis.com` at
  runtime (preconnect + stylesheet). No font module. i18n: `en` default unprefixed, `de` under
  `/de`, `prefix_except_default`, `lazy`, `langDir: locales/`.
- `app/layouts/default.vue`: `AppHeader` / `main` / `AppFooter`, nothing route-aware — the header
  is always a bar above the content, which is why the hero cannot run under it today.
- `app/components/HomeHero.vue`: the hero sits **inside** `container-page` as
  `rounded-[2rem] overflow-hidden`; wordmark is `text-[22vw] lg:text-[13.5rem]` (216px) at weight
  **700**. `22vw` is measured against the viewport but rendered inside a container narrower than
  the viewport, so at 390 the glyphs overflow the card and `overflow-hidden` clips them — that is
  finding 3, reproduced in `t2l-new-mobile-viewport.jpg`. The chips are a `flex-wrap` list of small
  pills with the plus icon left of the label, at every breakpoint.
- `app/components/AppHeader.vue`: `sticky top-0 bg-page/90 backdrop-blur`, `h-[76px]`; logo pill,
  a bordered nav pill with two hover dropdowns, a plain uppercase locale link (`DE`) in the nav and
  a second one for mobile, `btn-dark` login, burger. The locale link is derived from
  `locales`/`switchLocalePath`, so it already handles exactly two locales.
- `app/components/AppStoreCards.vue`: headline + the two round icons + eyebrow + paragraph are one
  `lg:grid-cols-2` row with no hairline; the store cards are `min-h-[240px]` with a `h-16 w-16`
  corner glyph at 15-20% opacity.
- `app/components/PartnerLogos.vue`: 13 logos as a centred `flex-wrap` list at `h-8`, which wraps
  to two rows at 1440.
- `app/components/FeatureCards.vue`: shared by home, `/for-business` and `/clubs` (`messageKey`
  prop) — a uniform `lg:grid-cols-3` grid with a single `lg:mt-10` offset on every third card,
  `text-xl` titles, `text-sm` body, and a `link-arrow` "Learn more" with the plus immediately after
  the label and no divider above it.
- `app/components/HomeUseCases.vue`: intro in `ml-auto max-w-xl`, four rows
  `divide-y divide-navy/30`, titles `sm:text-5xl` (48px), arrow `sm:h-14 sm:w-14`.
- `app/components/CtaBanner.vue`: used on almost every page; heading `lg:text-5xl` with two inline
  `0.9em` coin icons, one before and one after the title. No portrait assets exist in
  `public/images/**` (checked) — the two portraits must come from the original site.
- `app/components/AppFooter.vue`: already has the four column headings and the per-link hairlines;
  everything is `text-sm` with `py-16`, which is why it measures ~480px against the original's
  ~720px.
- `app/components/ShopCards.vue`, `app/components/PageHero.vue`: inner-page components that inherit
  whatever the shared scale and container do.
- `i18n/locales/en.json` / `de.json`: `home.hero.{tagline,text,wordmark,imageAlt,bullets[5]}`,
  `home.partners.title` (present but unrendered), `home.cta.{title,text}`. The mobile chips heading
  the original repeats is the existing `home.hero.tagline` — no new string needed for it.
- `package.json`: scripts are `build`/`dev`/`generate`/`preview` only. No test runner, no linter,
  no test directory.

## Approach

**The one change that does most of the work is the shared scale, and it belongs in `main.css`, not
in the components.** Tailwind 4 resolves `text-sm … text-6xl` from `--text-*` theme variables, so
overriding those variables (and their paired `--text-*--line-height`) with `clamp()` in the
existing `@theme` block makes every existing utility in every component fluid, without editing a
single class. `.container-page` widens the same way: keep the utility, raise the cap and make the
side margin fluid so that at 1440 the content lands at the original's ~1296px. This is extending
the pattern the repo already has (one token block, one container utility) rather than introducing
one. Rejected: adding a parallel set of `fluid-*` utilities and rewriting each component's classes
(touches every file, two competing scales, and inner pages silently keep the old one); rejected
too: a viewport-scaling hack on `html { font-size }` (breaks Tailwind's px-based spacing and the
`rem`-based `max-w-*` caps in unpredictable ways).

**The hero becomes a sibling of the container, not a child of it.** `HomeHero` keeps its structure
but its outer `<section>` drops `container-page` and the rounded/overflow-hidden card, becoming a
full-width block with square corners and its own fluid inner padding. Full-bleed must be expressed
as `w-full` on a section inside a container-free layout — **not** `100vw` or a negative-margin
`50vw` trick, both of which overflow by the scrollbar width and would break the "no horizontal
scroll" criterion. The header floats over it via a route-driven variant: `pages/index.vue` declares
`definePageMeta({ headerOverlay: true })`, `layouts/default.vue` reads `route.meta.headerOverlay`
and passes it as an `overlay` prop to `AppHeader`, which then renders transparent and absolutely
positioned over the hero instead of as a sticky bar. Every other page passes nothing and is
untouched. Rejected: `AppHeader` sniffing the route itself (works, but hard-codes the home path in
a shared component and breaks the moment a second overlay page appears).

**The wordmark is sized from the viewport and verified, not guessed.** Because the hero is now
full-bleed, a `clamp()` in `vw` against the viewport finally means what it says. The original is
~330px at 1440 — 22.9vw — at weight **600**, spanning nearly the full viewport width. The
Implementer sets a `clamp(min, <n>vw, max)` and tunes `<n>` until the rendered text box measures
between 90% and 100% of the hero's inner width at 360/390/430/768/1280/1440/1920, which is the
criterion. `overflow-hidden` on the hero stays (it crops the photo) but must never be what stops
the wordmark — the type has to fit by its own size.

**Sections are matched one by one against the original, at the corrected scale.** `AppStoreCards`
splits into two stacked rows with a full-width hairline between them (headline left / round icons
right-aligned on the same line, then `WHAT WE OFFER` left and the paragraph in the right half);
the store cards grow to ~210px and the corner glyph becomes a large cropped background watermark.
`PartnerLogos` becomes a single non-wrapping row of larger greyscale logos. `FeatureCards` gets
larger cards, a real staggered (masonry-like) column offset, a dashed divider above the
"Learn more" row and the plus right-aligned — and because it is shared, `/for-business` and
`/clubs` inherit the same treatment, which is wanted. `HomeUseCases` moves its intro paragraph into
the right half and grows titles, rows and the arrow button. `CtaBanner` grows and takes three
inline pills (two portraits + one icon) through a new optional prop, defaulting to today's
two-icon behaviour so the other pages are unaffected. `AppFooter` keeps its structure and only
grows type and vertical padding.

**Background and font.** `--color-page` becomes `#ffffff` and a new `--color-band` (`#f8f8fb`)
carries the light-grey bands; the Implementer identifies from the original at 1440 which sections
are banded and records that list in the report. `--font-body` is retired in favour of Inter, the
`body` base rule loses `font-body`, and the Google Fonts links in `nuxt.config.ts` are replaced by
`@font-face` rules pointing at committed `woff2` files in `public/fonts/` (`font-display: swap`,
latin + latin-ext, the weights actually used: 400/500/600/700).

**Scroll-in animation is optional and fenced.** If it is cheap: CSS only, no dependency, no JS
gating, nothing may depend on script to become visible (the site is a static export), and
`@media (prefers-reduced-motion: reduce)` disables it. If any of that does not hold, it is a
follow-up line in the report instead.

### Measured targets at 1440 (front desk, 2026-09-17, `unverified` by me — re-measure; the live original wins)

| Element | Original | New today | Target |
|---|---|---|---|
| Content width (viewport minus side margins) | ~1296px (~72px margins) | 1216px (`max-w-7xl` + `px-8`) | 1166–1426px |
| Hero | full-bleed, square corners, ~1260px tall, nav over the photo | boxed card in the container, rounded 2rem, below a grey nav strip | full-bleed, square, ~1134–1386px tall |
| Hero wordmark | ~330px, Inter **600** | 216px, Inter **700** | 297–363px, weight 600 |
| "Your personal digital assistant one tap away" | ~56px | 48px | 50–62px |
| "Features" | ~64px | 48px | 58–70px |
| Feature card title | ~26px | 20px | 23–29px |
| Body / card copy | ~17–18px | 14px | 16–19px |
| Use-case row title | ~72px | 48px | 65–79px |
| Use-case row height | ~80px | — | 72–88px |
| App-store card height | ~210px | 240px min | 189–231px |
| Footer height | ~720px | ~480px | 648–792px |

## Files to change

| File | Change | Why |
|---|---|---|
| `app/assets/css/main.css` | Override `--text-xs … --text-7xl` (+ paired line-heights) with `clamp()`; widen `.container-page` (fluid side margin, ~1296px content at 1440); `--color-page: #ffffff`, add `--color-band: #f8f8fb`; drop `--font-body`, body → Inter; add `@font-face` for self-hosted Inter; optional reduced-motion-safe fade-in utility | Findings 2 + 13; one token block lifts every page |
| `nuxt.config.ts` | Remove the two Google Fonts `preconnect` links and the stylesheet link | Self-hosted-fonts constraint |
| `public/fonts/` (new) | Inter `woff2` (latin + latin-ext), weights 400/500/600/700 | Self-hosting without an npm dependency |
| `app/pages/index.vue` | `definePageMeta({ headerOverlay: true })`; band classes on the sections the original bands; keep or drop `<ShopCards />` per gate 1 | Finding 1 + 13 + the Shop decision |
| `app/layouts/default.vue` | Read `route.meta.headerOverlay`, pass `:overlay` to `AppHeader`; no wrapper padding that would box the hero | Finding 1 |
| `app/components/AppHeader.vue` | New `overlay?: boolean` prop → transparent, absolutely positioned over the hero (non-sticky), pills unchanged; language switch becomes a flag + code pill | Findings 1, 12 |
| `app/components/HomeHero.vue` | Full-bleed square section outside the container; fluid `clamp()` wordmark at weight 600, no clipping at any width; headline left / sub-line right; mobile keeps the photo to the top; chips restyled per breakpoint (large full-width outlined cards with the plus **above** the label on phones, under a repeated `home.hero.tagline` heading; desktop per the original) | Findings 1, 3, 4 |
| `app/components/AppStoreCards.vue` | Two rows split by a full-width hairline; icons right-aligned on the headline's line; eyebrow left + paragraph in the right half; ~210px cards with a large cropped glyph watermark | Finding 5 |
| `app/components/PartnerLogos.vue` | One non-wrapping row, larger greyscale logos, generous spacing | Finding 6 |
| `app/components/FeatureCards.vue` | Larger cards, real staggered column offsets, dashed divider above the "Learn more" row, plus right-aligned | Finding 7 (also lifts `/for-business`, `/clubs`) |
| `app/components/HomeUseCases.vue` | Larger row titles and arrow buttons, ~80px rows, darker hairlines, intro paragraph in the right half | Finding 8 |
| `app/components/ShopCards.vue` | Restyle to the corrected scale (only if the section is kept) | Finding 9, default = keep |
| `app/components/CtaBanner.vue` | Grow to the original's size; new optional `pills` prop rendering three inline pills (two portraits + one icon); default stays today's two icons | Finding 10, other pages unaffected |
| `public/images/cta/` (new) | The two portrait images from the original's CTA banner | Finding 10 |
| `app/components/AppFooter.vue` | Larger logo and link type, more vertical padding (~720px at 1440); structure and the existing headings/hairlines unchanged | Finding 11 |
| `app/data/image-sizes.json` | Add intrinsic sizes for any new image | Keeps the `width`/`height` attributes the loader relies on |
| `i18n/locales/en.json`, `i18n/locales/de.json` | Any new string (portrait alt texts, language-switch label) in **both** files | i18n rule; German formal "Sie" |

## Acceptance criteria

1. `npm run generate` exits 0 and produces `.output/public/index.html` and
   `.output/public/de/index.html`.
2. At 1440, the home page's content column (viewport width minus the left and right margins of
   `.container-page`) is within ±10% of the original's ~1296px.
3. At 1440, the computed `font-size` of each of these home-page elements is within ±10% of the same
   element's computed `font-size` on `https://www.t2l.ink/`: the hero wordmark, the
   "Your personal digital assistant one tap away" headline, the "Features" headline, a feature-card
   title, a feature-card body paragraph, a use-case row title.
4. The hero wordmark's computed `font-weight` is 600.
5. The home hero spans the full document width: its bounding box left edge is 0 and its right edge
   equals `document.documentElement.clientWidth`, and its computed `border-radius` is `0px`.
6. On the home page the header renders over the hero photo (the header's bounding box overlaps the
   hero image's bounding box) and its own background is transparent; on `/pricing` the header is
   unchanged from today (sticky, `bg-page` with backdrop blur).
7. The hero wordmark is never clipped and never overflows: at 360, 390, 430, 768, 1280, 1440 and
   1920 its rendered text width is ≥90% and ≤100% of the hero's inner content width, and its full
   string is visible.
8. `document.documentElement.scrollWidth <= window.innerWidth` on `/` and `/de/` at 360, 390, 430,
   768, 1280, 1440 and 1920 — no horizontal scrollbar at any tested width.
9. `getComputedStyle(document.body).fontFamily` resolves to Inter on the home page, and the string
   "Nunito" appears nowhere in `.output/public/**` (CSS or HTML).
10. The generated HTML and CSS contain no request to `fonts.googleapis.com` or `fonts.gstatic.com`,
    and the Inter `woff2` files are served from the site's own `/fonts/` path.
11. `getComputedStyle(document.body).backgroundColor` is pure white (`rgb(255, 255, 255)`), and the
    sections that are light-grey on the original are light-grey (`#f8f8fb`) on the new page.
12. On phones (390) the hero photo reaches the top of the viewport with the logo pill and burger
    floating on it, and the five hero chips render as full-width outlined cards with the plus icon
    **above** the label, under a repeated "Making your life a little bit easier." heading.
13. The partner logos render as a single row at 1280, 1440 and 1920 (every logo's bounding-box
    `top` is equal), at a larger size than today's `h-8`.
14. Each feature card shows a dashed divider immediately above its "Learn more" row, with the plus
    icon right-aligned within that row, and the three columns are vertically staggered (the three
    first-row cards do not share the same bounding-box `top`).
15. The blue CTA banner on the home page renders three inline pills inside the headline, two of
    which contain portrait images served from the site's own `/images/` path; the CTA banner on
    `/pricing`, `/faq`, `/agro-solutions`, `/for-business` and `/clubs` still renders its two icon
    pills unchanged.
16. Every image added or changed by this task carries explicit `width` and `height` attributes, and
    the home page's Cumulative Layout Shift measured on the generated build is ≤ 0.1.
17. Every internal link in `.output/public/**` resolves to a generated file (no 404s), for both
    locales.
18. Every string added by this task exists in **both** `i18n/locales/en.json` and
    `i18n/locales/de.json`, and `/de/` renders no raw i18n key.
19. No new entry appears in `package.json` `dependencies` or `devDependencies`.
20. `netlify.toml`, DNS and Netlify settings are unchanged (`git diff --stat` shows no
    `netlify.toml`).
21. The report lists, per top-level page (agro solutions, for business, clubs, shop, pricing, use
    cases, blog, FAQ, contact), the remaining page-specific differences against its original, as
    follow-ups — and this task does not fix them.
22. The report lists every asset taken from the original site with its source URL and why Tap2Link
    owns it.
23. If a scroll-in animation is shipped, it is CSS-only, all content is visible with JavaScript
    disabled, and `@media (prefers-reduced-motion: reduce)` disables it; if it is not shipped, the
    report lists it as a follow-up.

## Test plan

No automated test suite exists in this repo (`package.json` has no test script and there is no test
directory), and adding a runner would be a new dependency, which the constraints forbid. Nothing is
"green" here by itself — every criterion is proven by a command, a browser read-back or a
screenshot, as listed below.

- Build: `npm run generate` from the worktree root, exit code checked.
- Static checks over `.output/public/**`: the Nunito string (criterion 9), the Google Fonts hosts
  (10), the internal-link crawl (17), the raw-i18n-key scan on `/de/index.html` (18).
- Browser pass against `npm run preview` (or the Netlify deploy preview) side by side with
  `https://www.t2l.ink/`, at 360, 390, 430, 768, 1280, 1440 and 1920, reading computed styles and
  bounding boxes from DevTools for criteria 2-8, 11-16.
- Regression pass: `/pricing`, `/faq`, `/agro-solutions`, `/for-business`, `/clubs`, `/contact`,
  `/blog`, one use-case page and one blog article opened at 1440 and 390 in both locales, to confirm
  the shared scale, container, header and footer changes did not break them (criteria 6, 15) — and
  to produce the follow-up list of criterion 21.

## What to click

1. Load `/` at 1440 next to the original and scroll top to bottom once: the two pages should reach
   the same sections at roughly the same scroll depth, at the same apparent size.
2. On `/` at 390, check the hero: photo to the very top, logo pill and burger floating on it, and
   the whole word "tap2link" visible with no cut-off `k`.
3. Open the burger menu on `/` at 390 and the two header dropdowns at 1440 — links still readable
   and clickable over the photo, menu closes on navigation.
4. Click the language pill on `/` and confirm it lands on `/de/` with the same layout, German copy,
   no raw i18n keys, and no line-break damage from the longer German words.
5. Expand "Learn more" on two feature cards and click one use-case row and the blue CTA button —
   the dashed divider, the stagger and the targets all still behave.

## Verification and evidence

The close-out report must carry, and not merely assert:

- The full `npm run generate` tail showing exit 0 and the prerendered route count (criterion 1).
- A measurement table with one row per element of criterion 3 plus criterion 2's content width:
  element, original computed value, new computed value, delta %, all at 1440, read via
  `getComputedStyle` in DevTools on both sites. Any value re-measured differently from the
  "measured targets" table above is flagged with both numbers.
- A table of `document.documentElement.scrollWidth` vs `window.innerWidth` for `/` and `/de/` at
  360, 390, 430, 768, 1280, 1440, 1920 (criterion 8).
- Side-by-side screenshots, **original left / new right**, at 1440x900 and 390x844, for the hero,
  the offer section, features, use cases, the CTA and the footer — written to
  `C:\code\tap2link\design\reference\2026-09-17-webflow-vs-nuxt\after\` and referenced by filename
  in the report.
- The output of the internal-link crawl over `.output/public/**` (criterion 17) and of the
  `Nunito` / `fonts.googleapis.com` / `fonts.gstatic.com` scans (criteria 9, 10).
- The CLS number for the home page from a Lighthouse or Performance run on the generated build
  (criterion 16).
- `git diff --stat` for the branch, showing `netlify.toml` untouched and `package.json` either
  untouched or changed without a new dependency (criteria 19, 20).
- The asset provenance list (criterion 22): every file taken from the original site, its source
  URL, and the reason it is Tap2Link's own.
- The per-page follow-up list (criterion 21) and, if applicable, the scroll-animation follow-up
  (criterion 23).

## Will not do

- No `git checkout`, `rebase`, `merge` or `push`; `main` and `dev` are not touched.
- No commits anywhere outside this landing worktree — the screenshots written into
  `C:\code\tap2link\design\reference\...` are left uncommitted.
- No other repository is edited (`tap2link-website`, `tap2link-app`, the backend, the docker repos).
- No changes to `netlify.toml` (including its security headers), DNS, Netlify site settings or
  analytics.
- No change to the live Webflow site; it is read in a browser only.
- No copy changes in `en.json` / `de.json` beyond adding strings the new markup needs.
- No new pages, no PL/RO locales, no contact-form backend work.
- No new npm dependency, no new Nuxt module, no runtime third-party resource.
- No fixes to the page-specific differences found on the nine other top-level pages — they are
  listed, not fixed.
- No `npm install` of an updated lockfile resolution; `package-lock.json` is left as it is.

## Stop conditions

- `https://www.t2l.ink/` cannot be opened in a real browser, or its computed styles cannot be read:
  stop and ask. The targets table above is a second-hand record, not a licence to guess the rest.
- A re-measured value differs from the "measured targets" table by more than 10%: do not silently
  follow either number — implement to the measured original and flag the discrepancy in the report
  before gate 3.
- One of the two CTA portrait images looks like licensed stock photography rather than a Tap2Link
  team photo, or its provenance cannot be evidenced: stop and ask rather than committing it. The
  banner ships with icon pills until Christian decides.
- Inter `woff2` files cannot be obtained without a network fetch the environment blocks, or
  self-hosting would need an npm module: stop and ask; the fallback (keep the Google Fonts link,
  drop Nunito Sans from it) is a gate-1 decision, not the Implementer's.
- Making the fluid `--text-*` scale land on the targets visibly breaks an inner page (overlapping
  type, a broken table on `/pricing`, clipped copy in German): stop and ask before either shrinking
  the home-page target or special-casing that page.
- The hero can only be made full-bleed by introducing `100vw` / negative-margin tricks that cause a
  horizontal scrollbar: stop and ask rather than trading criterion 8 for criterion 5.
- Matching a section would need a copy change or a new page: stop; both are out of scope.

## Risks and open questions

- **The measurement round is the bulk of the work and it is manual.** No automated check can prove
  criteria 2-8 and 11-16 in this repo; they are DevTools read-backs plus the "What to click" pass.
  If the environment running the Implementer has no browser, the task cannot be finished as
  specified — that is the first stop condition, and the reason it is listed first.
- Criterion 16's CLS number and criterion 3's cross-site comparison both depend on tooling
  (Lighthouse, DevTools) rather than on the repo; if either is unavailable, the report must say so
  explicitly instead of claiming the criterion passed.
- Redefining Tailwind's `--text-*` variables changes **every page and every component**, including
  `PricingTable`, `FaqAccordion`, `ContactForm` and the `prose-t2l` long-form pages. That is the
  point (the brief wants the lift), but it is also the largest regression surface in this task — the
  regression pass in the test plan is not optional.
- German copy is longer than English; a larger type scale plus a wider container can still produce
  new line breaks in the nav, the footer headings and the CTA headline at `/de/`. Checked by "What
  to click" line 4, not by any automated check.
- The original's partner row appears to scroll/marquee. This spec asks only for a single static row
  at the right size; a marquee (which would likely need JS or a long CSS animation) is deliberately
  not specified — if Christian wants the movement, it is a follow-up.
- The original's header behaviour on scroll is unverified (see Assumptions); the default chosen —
  non-sticky overlay on the home page only — is a guess that the Implementer must confirm in the
  browser. If the original keeps a sticky bar that turns solid after the hero, that is a small
  extra state, not a redesign.
- `FeatureCards` is shared with `/for-business` and `/clubs`; the dashed divider and the stagger
  will appear there too. Assumed wanted (the original uses the same component on those pages) —
  `unverified` against those two originals; the per-page audit (criterion 21) will show it.
- Criterion 21's per-page audit produces a list whose length is unknown until it is done; it may be
  long enough to justify its own follow-up task rather than a paragraph in this report.

## Out of scope

- Fixing the page-specific differences on agro solutions, for business, clubs, shop, pricing, use
  cases, blog, FAQ and contact — those are found and listed as follow-ups only.
- The partner row's marquee/scroll motion.
- Copy changes, the German proofread recorded in `README.md` "Decisions to confirm" #4, and the
  English typos kept from the live site.
- New pages, PL/RO locales, the contact form's backend, DNS, Netlify settings, analytics.
- The Lottie animation the original layers over the hero photo (`README.md` #6) — still a static
  photo.
- The Splide carousels the original uses on `/for-business`.
- Replacing `public/images/og-image.jpg` with a branded image (`README.md` #3).
- Any refactor of `AppHeader`'s dropdown logic, `useContent.ts` or the `usePageSeo` composable.

## Proposed split (Christian decides)

Four independently mergeable vertical slices, riskiest first. Each is a complete, shippable path —
not one layer at a time — and none exceeds ~5 files.

1. **Shared scale foundation** (~4 files: `main.css`, `nuxt.config.ts`, `public/fonts/`,
   `app/pages/index.vue` band classes). Fluid `--text-*` clamps, the wider `.container-page`, white
   page + `--color-band`, body → Inter, self-hosted fonts. Riskiest: it changes every page at once
   and carries the font decision. Proves criteria 1-3, 9-11, 19, 20 and the regression pass alone.
2. **Full-bleed hero + floating header** (~4 files: `HomeHero.vue`, `AppHeader.vue`,
   `layouts/default.vue`, `pages/index.vue`). The hero, the overlay header, the fluid wordmark, the
   mobile clipping bug and the per-breakpoint chips. Proves criteria 4-8, 12.
3. **Mid-page sections** (~5 files: `AppStoreCards.vue`, `PartnerLogos.vue`, `FeatureCards.vue`,
   `HomeUseCases.vue`, `ShopCards.vue`). Proves criteria 13, 14 and the offer/features/use-cases
   screenshots.
4. **CTA, footer, language pill and the page audit** (~5 files: `CtaBanner.vue`, `AppFooter.vue`,
   `AppHeader.vue` language pill, `public/images/cta/`, both locale files). Proves criteria 15, 18,
   21, 22 — and carries the asset-provenance stop condition.
