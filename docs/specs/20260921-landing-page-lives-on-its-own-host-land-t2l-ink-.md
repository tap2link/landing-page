---
task: 20260921-landing-page-lives-on-its-own-host-land-t2l-ink-
company: tap2link
status: ready
size: M
branch: fix/landing-page-lives-on-its-own-host-land-t2l-ink-
base: dev
design: none
---

# Move the marketing site onto its own host `https://land.t2l.ink` and make every link into the app absolute

## Goal

The landing page stops sharing a host with the app. It gets its own host `https://land.t2l.ink`
(served by Netlify directly); the app keeps `https://t2l.ink` (login, profiles, tag links), and
`https://www.t2l.ink/*` plus the root of `https://t2l.ink/` will 301 to `https://land.t2l.ink` on the
load-balancer side, which is not part of this task. Inside this repo three things must change so the
site is correct on a separate host: every link that targets an app path must be an absolute
`https://t2l.ink/...` URL built from one central place; every declaration of the site's own public
URL (nuxt config, canonical, `og:url`, hreflang, sitemap base, `robots.txt`) must say
`https://land.t2l.ink`; and `netlify.toml` must carry a few explicit 301s as a safety net for people
who type app paths on the landing host. A new repo script proves all of this from the generated HTML.

## Assumptions

- The brief's "known" defect no longer exists on this branch: `app/data/links.ts` has **no relative
  `/login`**. Line 4 is `login: 'https://t2l.ink/welcome'` and line 6 is
  `getStarted: 'https://t2l.ink/welcome'` (line 3 is a comment); the same file on the `main` checkout
  `C:\code\tap2link\tap2link-landing-page\app\data\links.ts` is identical. I searched the whole `app/`
  tree for `href`/`:to`/`action`/`$fetch`/`navigateTo` and found no other link, form action or fetch
  that targets an app path. So this task adds the central constant and the automated guard, and does
  not "fix" a link that is already absolute.
- The header "Log in" button keeps its current target `https://t2l.ink/welcome`, not
  `https://t2l.ink/login`: `README.md` "Decisions to confirm" #2 records that the live header links to
  `/welcome` and that there is no `/login` link anywhere in the live HTML. I read the brief's click
  check "its login button opens https://t2l.ink/login" as "opens an absolute URL on the app host
  `t2l.ink`". If the target should really become `/login`, say so at gate 1 — it is one line in
  `app/data/links.ts` and one line in the click checklist.
- The app host is exactly `https://t2l.ink` (no `www`, https only) for every link into the app.
- The site's own host is exactly `https://land.t2l.ink` — https, no `www.`, no trailing slash in the
  configured value.
- Netlify domain settings, DNS and the 301s from `www.t2l.ink` / `t2l.ink/` are done outside this repo
  (the brief says so). Consequence I accept: on the deploy preview, and on production until those
  land, the pages declare a canonical host they are not served from. That is intended.
- The background documents the brief cites could not be read: the knowledge base's
  `infra/lb-cutover-2026-09-21/PLAN.md` has no "Direction changed" top section, and there is no
  `STEP3.md`; a search of all of `C:\code\tap2link` for `land.t2l.ink` and for `Direction changed`
  returned zero hits. I worked from the brief plus the PLAN.md that does exist (2026-09-21, the
  "default → app, allowlist → landing" direction). Unverified: anything in the newer direction
  document that contradicts the brief.
- Unverified, because this session had no shell: I could not run `npm run generate`. Every statement
  below about the generated output — including why no sitemap appears — is a hypothesis for the
  Implementer to confirm from a real build, not an observation.
- `npm run generate` writes `.output/public` (verified by the 20260917 spec in this repo) while
  `netlify.toml` publishes `dist`; the new check script therefore accepts either directory.
- No new npm dependency and no `package-lock.json` change: `README.md` warns that a fresh resolve
  without the lockfile currently fails on a vite peer conflict. The check script is plain Node 24,
  zero dependencies.
- "The page URLs themselves are unchanged" means: the set of HTML files the build emits is identical
  to today's, and no file under `app/pages/`, `content/` or `i18n/` is touched.
- No screen, layout or copy changes, so `design: none`; `design/STATUS.md` was not consulted.
Correct me at gate 1, otherwise I proceed with these.

## Context found

- `nuxt.config.ts`: declares the site's own URL **three times** — `site.url`,
  `runtimeConfig.public.siteUrl`, and `i18n.baseUrl` — all `https://www.t2l.ink`. `site.url` feeds
  `@nuxtjs/sitemap`, `i18n.baseUrl` feeds the canonical and hreflang tags, `public.siteUrl` feeds
  `usePageSeo`. Also holds `modules: ['@nuxtjs/i18n', '@nuxtjs/sitemap']`, `nitro.prerender`
  (`crawlLinks: true`, `routes: ['/']`) and the icon/font `<link>`s.
- `app/app.vue`: `useLocaleHead({ seo: true, lang: true })` — this is the only source of
  `<link rel="canonical">` and of the `hreflang` alternates; both are built from `i18n.baseUrl`.
- `app/composables/usePageSeo.ts`: builds `og:url` and the OG image URL from
  `config.public.siteUrl` with a hardcoded fallback literal `'https://www.t2l.ink'` (line 19). No
  canonical here.
- `app/data/links.ts`: the repo's single place for external URLs. `login` and `getStarted` are the
  only two entries that point into the app, both already `https://t2l.ink/welcome`.
- `app/components/AppHeader.vue` (lines 97, 122) and `app/components/PricingTable.vue` (lines 75,
  101, 122) are the only consumers of those two entries; every other in-site link goes through
  `localePath()`/`NuxtLink` and stays relative, which is correct.
- `app/components/ContactForm.vue`: the contact form is a **Netlify Form**. Static markup carries
  `name="contact"`, `data-netlify="true"`, no `action`; submit does `$fetch('/', { method: 'POST' })`,
  form-encoded, with the `form-name` field. It posts to the landing host's own root — it does **not**
  use `/contact-api/...` and must not be rewritten to the app host.
- `public/robots.txt`: `Sitemap: https://www.t2l.ink/sitemap_index.xml`.
- `netlify.toml`: build `npm run generate`, publish `dist`, `NODE_VERSION = "24"`, one `[[headers]]`
  block. No `[[redirects]]` at all today.
- `package.json`: `@nuxtjs/sitemap` ^8.5.0 and `@nuxtjs/i18n` ^10.6.0 (lockfile resolves sitemap
  8.5.0, which depends on `nuxt-site-config` ^4.2.3). `node_modules` is **not** installed in this
  worktree. Scripts: `build`, `dev`, `generate`, `preview`, `postinstall` — no test/check script.
- No `scripts/`, `test/` or `tests/` directory exists yet; the repo has no automated test of any kind.
- `knowledge-base/infra/lb-cutover-2026-09-21/PLAN.md` §2 (last row) and §7.4 independently report the
  sitemap symptom: `@nuxtjs/sitemap` is installed and `robots.txt` points at `/sitemap_index.xml`, but
  the deployed output contains no `sitemap*.xml` at all.
- `C:\code\tap2link\CLAUDE.md`: English everywhere in code/docs/commits; `main` is the Netlify
  production branch, `dev` is the base, merges by PR.

## Approach

Two constants, one new checker, five small edits.

**One place for each host.** The repo already has the right pattern for this and it is per-side:
`app/data/links.ts` is documented as "every external URL", so the *app* host belongs there — add an
exported `APP_BASE_URL = 'https://t2l.ink'` plus a tiny `appUrl(path)` helper and derive `login` and
`getStarted` from it, so a future app link cannot be written relative by accident and a host change is
one line. The *site's own* host is a build/config concern, so it gets a single `const SITE_URL =
'https://land.t2l.ink'` at the top of `nuxt.config.ts`, used for `site.url`,
`runtimeConfig.public.siteUrl` and `i18n.baseUrl`; `usePageSeo.ts`'s hardcoded fallback literal and
`public/robots.txt`'s `Sitemap:` line are updated to the same host (neither can import the constant —
one is a defensive fallback, the other a static file). Rejected: a runtime-config `public.appBaseUrl`
for the app host (the brief offers it as an alternative). It would work, but it puts a value that is
never environment-dependent into runtime config and forces every consumer through
`useRuntimeConfig()`, which `links.ts` consumers currently do not need; and it would tempt the check
script into reading the same config it is supposed to verify. Also rejected: replacing
`public.siteUrl` with `useSiteConfig()` from `nuxt-site-config` — a tidier design, but a refactor of
working code that this task does not need.

**Netlify safety net.** Four explicit `[[redirects]]` in `netlify.toml` — `/login`, `/register`,
`/welcome` to the same path on `https://t2l.ink`, and `/app/*` to `https://t2l.ink/app/:splat` — all
`status = 301`, none with `force = true` and no catch-all, so the site's own files and its 404 page
always win and a future landing route of the same name would simply take precedence. Netlify forwards
the incoming query string when the destination carries none, so the query is preserved without extra
configuration (unverified from this machine; the click checklist covers it). Deliberately **not**
redirected: `/api/*`, `/auth-api/*`, `/contact-api/*` — nobody types those, and a 301 on a non-GET
call is a broken call rather than a safety net.

**The checker is the test.** This repo has no test runner and adding one is not this task's job, so
acceptance is a single zero-dependency Node script, `scripts/check-links.mjs`, wired as
`npm run check:links`. It walks the generated HTML and asserts the properties the brief names, prints
one `PASS`/`FAIL` line per check (running all of them before exiting) and exits non-zero on any
failure. Two design rules for it: it hardcodes the expected origins `https://land.t2l.ink` and
`https://t2l.ink` as its own literals and never imports `SITE_URL`/`APP_BASE_URL` (a checker that
imports the value it verifies proves nothing), and it fails loudly if it finds zero HTML files
instead of passing on an empty directory.

**The sitemap.** The brief bounds this: fix it if it is a small configuration error, otherwise leave
it and say so. Two hypotheses are worth testing in that order, both cheap, both decided by reading a
real build: (H1) a sitemap *is* emitted, but under a different filename than `robots.txt` names —
`@nuxtjs/sitemap` emits a single `/sitemap.xml` unless multiple sitemaps (e.g. per-locale via the i18n
integration) are configured, in which case it emits an index; if so the fix is the `robots.txt` line
(and optionally an explicit `sitemap` config block) and nothing else. (H2) nothing is emitted because
the sitemap routes never reach the prerender list, in which case adding them to
`nitro.prerender.routes` (or a minimal `sitemap: { … }` block) is still a small config change. If
neither is it — for example if the build logs an incompatibility between `@nuxtjs/i18n` 10 and
`@nuxtjs/sitemap` 8 — that is past "small configuration error": stop, change nothing about the module,
and report the finding with the log evidence. No module version change either way.

## Files to change

| File | Change | Why |
|---|---|---|
| `nuxt.config.ts` | Add `const SITE_URL = 'https://land.t2l.ink'` above `defineNuxtConfig`; use it for `site.url`, `runtimeConfig.public.siteUrl` and `i18n.baseUrl`. Only if the sitemap investigation lands on a small config fix: add the minimal `sitemap` / `nitro.prerender.routes` entry it needs. | One declaration of the site's own host; it feeds the sitemap, canonical/hreflang and `og:url` |
| `app/data/links.ts` | Add exported `APP_BASE_URL = 'https://t2l.ink'` and `appUrl(path: string)`; derive `login` and `getStarted` from `appUrl('/welcome')`, keeping the existing comments | One declaration of the app host, so no link into the app can be relative by accident |
| `app/composables/usePageSeo.ts` | Line 19 fallback literal `'https://www.t2l.ink'` → `'https://land.t2l.ink'` | Otherwise a stale host leaks into `og:url` whenever runtime config is empty |
| `public/robots.txt` | `Sitemap:` line → `https://land.t2l.ink/<the sitemap file the build actually emits>` | Static file, cannot read the config |
| `netlify.toml` | Add four `[[redirects]]` blocks (`/login`, `/register`, `/welcome`, `/app/*` → `https://t2l.ink…`, 301, no `force`, no catch-all) | Safety net for typed app paths on the landing host |
| `scripts/check-links.mjs` | New: the acceptance checker described below, zero dependencies | Proves the criteria mechanically and keeps proving them |
| `package.json` | Add `"check:links": "node scripts/check-links.mjs"` | One command for the Tester and for later runs |
| `README.md` | Note the site's own host (`land.t2l.ink`), that links into the app go through `appUrl()` from `app/data/links.ts`, and the `npm run check:links` command; correct the sitemap filename sentence if H1 turns out to be the case | The README is this repo's only documentation |

## Acceptance criteria

1. `npm ci` followed by `npm run generate` exits 0 on the branch.
2. `npm run check:links` exits 0 after a successful `npm run generate`, and prints one `PASS` line per
   check listed in criteria 4–10.
3. `scripts/check-links.mjs` runs on plain Node 24 with no dependency outside the standard library,
   resolves its input directory as the first existing of `.output/public` and `dist` (an optional
   first CLI argument overrides it), exits non-zero with a clear message if neither exists, and exits
   non-zero if it finds zero `.html` files.
4. No `href="…"` or `action="…"` attribute value in any generated `.html` file starts with `/login`,
   `/register`, `/welcome`, `/app`, `/api`, `/auth-api` or `/contact-api` — the check reports every
   offending file, attribute and value.
5. In every generated `.html` file, every `<link rel="canonical">` `href`, every `og:url` `content`
   and every `<link rel="alternate" hreflang="…">` `href` starts with `https://land.t2l.ink`.
6. The string `www.t2l.ink` does not appear anywhere in the generated output's `.html` files.
7. For every generated page, the canonical URL's path equals that page's own route (ignoring a
   trailing slash) — e.g. `.output/public/de/pricing/index.html` has canonical
   `https://land.t2l.ink/de/pricing`, and the home page has `https://land.t2l.ink/`.
8. The set of generated `.html` files equals the expected list the script carries: the 21 English
   routes of `README.md`'s URL map plus their 21 `/de/...` counterparts, plus exactly the non-route
   HTML files the build emits today (e.g. `404.html`, `200.html`); a missing or an extra file fails and
   is named. No route is renamed and `/de/...` paths are unchanged.
9. `public/robots.txt`'s `Sitemap:` line is a single absolute URL starting with
   `https://land.t2l.ink/`, and the check asserts that.
10. Sitemap, whichever way the investigation lands: if the build emits any `sitemap*.xml`, every
    `<loc>` in it starts with `https://land.t2l.ink/` and `robots.txt`'s `Sitemap:` line names a file
    that actually exists in the output (both asserted by the script); if the build emits none, the
    script prints a `WARN: no sitemap emitted` line that does **not** fail the run.
11. The close-out states in one or two sentences why no sitemap was generated, backed by the build log
    and the output listing, and whether it was fixed as a small configuration error or deliberately
    left alone. No dependency version was changed either way.
12. `netlify.toml` contains exactly four `[[redirects]]` blocks — `/login` → `https://t2l.ink/login`,
    `/register` → `https://t2l.ink/register`, `/welcome` → `https://t2l.ink/welcome`, `/app/*` →
    `https://t2l.ink/app/:splat` — each with `status = 301`, none with `force = true`, and no rule
    whose `from` is `/*` or otherwise matches every path.
13. The existing `[build]`, `[build.environment]` and `[[headers]]` blocks of `netlify.toml` are
    unchanged.
14. The two app-bound entries in `app/data/links.ts` resolve to `https://t2l.ink/welcome`, and they are
    built from the single exported `APP_BASE_URL`; no literal `https://t2l.ink` remains anywhere else
    in `app/`.
15. `https://land.t2l.ink` appears in `nuxt.config.ts` exactly once, as the `SITE_URL` constant, and
    `site.url`, `runtimeConfig.public.siteUrl` and `i18n.baseUrl` all reference that constant.
16. `git diff --stat` against the branch point shows no change under `app/pages/`, `content/` or
    `i18n/`, and inside `nuxt.config.ts` no change to `i18n.locales`, `i18n.defaultLocale`,
    `i18n.strategy` or `i18n.langDir` (the only i18n change is `baseUrl`).
17. `app/components/ContactForm.vue` is unchanged: the form still carries `data-netlify="true"` with no
    `action` attribute and still posts to `/` on its own host.
18. The PR is open against `dev`, and every commit message follows
    `20260921-landing-page-lives-on-its-own-host-land-t2l-ink-: <what changed, imperative>` and ends
    with the `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>` line.

## Test plan

This repo has no test runner and this task does not add one; the new script is the automated test.
Commands, from the worktree root:

```
npm ci                 # the committed lockfile, never a fresh resolve
npm run generate       # must exit 0
npm run check:links    # must exit 0, prints the PASS/WARN report
```

The Tester verifies end to end: that `npm run generate` exits 0 and its prerendered-route count is the
same as before the change; that `check:links` passes and its report covers criteria 4–10 by name; that
the sitemap line of the report matches whatever the close-out claims about criterion 11; that
`netlify.toml`'s redirect block matches criterion 12 exactly (read the file, count the blocks); and
that the Netlify deploy preview of the PR passes the click checklist below. A red `check:links` run
must be reported with its full output, not summarised.

## What to click

1. The preview's home page renders as before — header, hero, partner logos, footer, images all present
   and styled, no broken image boxes.
2. The header "Log in" button opens the app's login entry on the app host in a new tab: today
   `https://t2l.ink/welcome` (see Assumptions — say so at gate 1 if it should be `/login`).
3. `/de/pricing` renders in German and the language switch moves between `/pricing` and `/de/pricing`;
   one blog article, `/blog-articles/oceanmata-x-tap2link`, renders with its cover image.
4. A nonsense path such as `/definitely-not-a-page` shows the landing site's own 404 page — not a
   redirect to `t2l.ink`, not a blank Netlify page.
5. `/login?test=1` on the preview host lands on `https://t2l.ink/login?test=1` (query kept), and
   `/app/settings` lands on `https://t2l.ink/app/settings`.

## Verification and evidence

- Criterion 1: paste the tail of `npm run generate` showing exit 0 and the prerendered route count.
- Criteria 2, 4–10: paste the **full** `npm run check:links` output. It is the evidence; "tests green"
  without the report does not close these.
- Criteria 9–11: paste the directory listing of `sitemap*.xml` in the output directory (a real listing,
  including the "no matches" case) plus any sitemap-related lines from the generate log, and the one-
  or two-sentence diagnosis.
- Criteria 12–13: paste the whole `netlify.toml` after the change.
- Criteria 14–15: paste the changed lines of `app/data/links.ts` and the `SITE_URL` constant plus its
  three usages in `nuxt.config.ts`.
- Criteria 16–17: paste `git diff --stat` for the branch and confirm `ContactForm.vue` is absent from it.
- What to click 1–5: the deploy-preview URL plus one line per item saying what was seen; for item 5,
  the landed URL (or `curl -sI <preview>/login?test=1` showing `301` and the exact `Location`).
  Screenshots of the preview home page and of `/de/pricing`.

## Will not do

- No `git checkout`, `rebase`, `merge` or `push` of `dev` or `main`, and no merging of the PR —
  Christian merges `dev` into `main` himself.
- No change in any other repo (`tap2link-website`, `tap2link-app`, the docker repos, the knowledge
  base).
- No Google Cloud, Cloud DNS, load-balancer or Netlify-dashboard change: no domain, primary domain,
  environment variable or build setting touched outside `netlify.toml`.
- No new npm dependency, no `package-lock.json` change, no `npm install` that re-resolves the tree, no
  version bump of `@nuxtjs/sitemap` or `@nuxtjs/i18n`.
- No route renamed, added or removed; no page, copy, translation or design change.
- No catch-all redirect, no `force = true`, no redirect for `/api/*`, `/auth-api/*` or
  `/contact-api/*`.
- No `app.buildAssetsDir = '/_landing/'` and no move of `public/images/**` (PLAN.md step 1 — its
  collision reason disappears on a separate host; if it is still wanted it is its own task).
- No touching of `app/components/ContactForm.vue` or the Netlify Forms setup.

## Stop conditions

- The sitemap turns out to need more than a small configuration change (a module upgrade, a
  version-compatibility problem, a rewrite): stop, leave the module and the config as they are, and
  report it with the log evidence.
- `npm run generate` already fails on the branch before any edit: stop and report the failure —
  do not start fixing a pre-existing break inside this task.
- `npm ci` cannot install from the committed lockfile: stop and report. Never re-resolve
  `package-lock.json` to get a green build.
- A criterion cannot be made to pass because the code contradicts it — e.g. `useLocaleHead` emits a
  canonical in a shape criterion 7 does not describe: stop, quote the exact generated string, and ask
  (this is a `spec` verdict, not something to code around).
- Criterion 8's expected file list does not match the build output for a reason other than this
  change: stop and report the diff rather than editing the list to make it pass.
- Christian answers at gate 1 that the "Log in" target should be `https://t2l.ink/login`: apply that
  one change and the matching click-check line, and leave everything else as specified.

## Risks and open questions

- The "Log in" target (`/welcome` vs `/login`) is the one thing in this spec that is a judgement call
  rather than a fact; Assumptions names it, gate 1 settles it, and flipping it costs one line.
- Ordering risk for Christian, not for the code: once this is merged into `main`, production declares
  canonicals and hreflang for `land.t2l.ink`. Until Netlify and DNS actually serve that host, crawlers
  see a canonical host that does not resolve. Users are unaffected (the site still renders wherever it
  is served). Worth merging `dev` → `main` close to the Netlify/DNS switch.
- Netlify's query-string preservation on a `[[redirects]]` rule whose `to` has no query is documented
  behaviour but unverified from this machine; it is only provable on the deploy preview, hence click
  check 5.
- The contact form's `$fetch('/')` (Netlify Forms) must stay on the landing host. Criterion 4's app-path
  rule does not cover `/`, so the script cannot catch a regression that rewrote the form to the app
  host; criterion 17 covers it by inspection only. Named here as the one undertested spot.
- `@nuxtjs/i18n` 10 and `@nuxtjs/sitemap` 8 are both recent majors; the sitemap symptom may well be
  their interplay, in which case the brief's own escape clause applies and this task reports instead
  of fixing.
- Once Netlify's primary domain becomes `land.t2l.ink`, Netlify itself 301s any other hostname it
  serves to that host (PLAN.md §3). Deploy previews are exempt, so the click checks stay valid; no
  action in this repo.
- I could not read the "Direction changed" section and `STEP3.md` that the brief cites — they do not
  exist in the knowledge base I can see. If they contain a target host or a redirect list different
  from the brief's, this spec inherits that error.

## Out of scope

- Design and copy changes of any kind, including the imprint's prose line `Internet: https://t2l.ink`
  (the apex root will 301 to the landing host anyway).
- Anything in the app repos, including removing `tap2link-website`'s now-dead
  `middleware/redirectToWebflow.global.ts` branches (PLAN.md §6).
- Anything in Google Cloud (URL map, certificates, DNS) or in Netlify's domain settings, including
  setting `land.t2l.ink` as the site's primary domain and clearing the stale `t2l.ink` custom domain.
- A redirect from the `*.netlify.app` hostname — Netlify does that itself once the primary domain is
  set.
- The `/_landing/` asset-prefix work from PLAN.md step 1, and any `@nuxtjs/sitemap` upgrade.
- Introducing a test runner (Vitest/Playwright) or a CI workflow for this repo.
