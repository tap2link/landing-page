---
task: 20260921-landing-page-the-safety-redirects-to-the-app-do-
company: tap2link
status: ready
size: S
branch: fix/landing-page-the-safety-redirects-to-the-app-do-
base: dev
design: none
---

# Move the four app-path safety redirects from `netlify.toml` into `public/_redirects` so they actually fire

## Goal

`https://land.t2l.ink/login`, `/register`, `/welcome` and `/app/abc` answer 404 in production even
though `netlify.toml` on `main` declares four 301s for exactly those paths. The cause is that
`nuxt generate` on Netlify writes its own `_redirects` file into the publish directory, ending in
`/* /404.html 404`; Netlify evaluates `_redirects` before `netlify.toml` and the first matching rule
wins, so the catch-all answers before the `netlify.toml` rules are ever consulted. This task makes
the four redirects fire for real by declaring them in the one file the generator merges instead of
overrides — `public/_redirects` — removes the dead `[[redirects]]` block from `netlify.toml` so the
repo carries a single mechanism, and adds a check to `scripts/check-links.mjs` so the ordering is
asserted on every build instead of assumed. The site's own 404 page keeps answering every other
unknown path and no page URL changes.

## Assumptions

- The brief's "likely cause" is **confirmed from source**, not from a build: in `nitropack@2.13.4`
  (the version `package-lock.json` pins, installed at
  `C:\code\tap2link\tap2link-landing-page\node_modules\nitropack`), `dist/presets/netlify/preset.mjs`
  defines the `netlify-static` preset with `output.dir = {{rootDir}}/dist` and a `compiled` hook that
  calls `writeRedirects(nitro)`; `dist/presets/netlify/utils.mjs` `writeRedirects` starts its content
  with `"/* /404.html 404"` whenever `nitro.options.static` is true and a `404.html` exists. With no
  `routeRules` and no pre-existing `_redirects`, that single line **is** the whole generated
  `dist/_redirects`. The Implementer still reproduces it once (see "Verification and evidence")
  before changing anything.
- The same `writeRedirects` explicitly supports a hand-written file: if `_redirects` already exists in
  the publish directory it reads it and writes `currentRedirects + "\n" + contents`, i.e. **our rules
  first, Nitro's `/* /404.html 404` fallback after** — unless the existing file itself contains a line
  matching `/^\/\* /m`, in which case Nitro logs "Not adding Nitro fallback" and leaves the file
  untouched. So `public/_redirects` must never contain a `/*` catch-all of its own.
- Netlify copies `public/_redirects` into the publish directory as an ordinary public asset before the
  `compiled` hook runs (`copyPublicAssets` precedes `buildProduction`, which fires `compiled` last —
  `nitropack/dist/core/index.mjs`). Unverified by a real build; this is the behaviour the
  `existsSync(redirectsPath)` branch above exists for.
- **Locally, `npm run generate` does not use the Netlify preset at all.** `presets/_resolve.mjs`
  falls back to `provider` from `std-env`; off Netlify that is empty, so Nitro resolves the plain
  `static` preset (`output.dir = .output`, `publicDir = .output/public`) whose hooks never call
  `writeRedirects`. Consequence I build on: a plain local `npm run generate` produces
  `.output/public/_redirects` = the verbatim copy of `public/_redirects`, **without** Nitro's
  catch-all; the real Netlify shape is reproduced locally only with `NITRO_PRESET=netlify-static`.
  Both shapes must pass the new check.
- Netlify forwards the incoming query string to the target when the target carries no query of its
  own, so `/register?x=1` → `https://t2l.ink/register?x=1` needs no extra syntax. This is the same
  assumption the `netlify.toml` comment already made; the deploy-preview curl proves it.
- "The four safety redirects" means exactly the four rules that are in `netlify.toml` today, at
  parity: `/login`, `/register`, `/welcome`, `/app/*`. Not added: `/app` without a trailing segment,
  `/de/login` and friends, `/api/*`, `/auth-api/*`, `/contact-api/*`.
- The site's own 404 page is **Nuxt's built-in error page** — this repo has no `app/error.vue` and no
  `pages/404`. "The landing page's own 404 page must keep working" therefore means: the deploy keeps
  answering 404 with its generated `404.html`, not that the page is branded.
- `netlify.toml`'s `[[headers]]` block is unaffected by removing `[[redirects]]`: Netlify merges
  headers from `_headers` and `netlify.toml` additively (they are not first-match like redirects).
  Unverified against the live site; criterion 14 turns it into a check rather than a belief.
- Unverified, because this session had no shell: I could not run `npm run generate`, `curl`, or
  `git log`. Every statement about generated output is read from the installed generator's source,
  not observed. `node_modules` is absent in this worktree — the Implementer runs `npm ci` first
  (README warns a symlinked `node_modules` breaks the build in a worktree).
- Size S rather than M: four files, but the substance is one new 12-line static file, one block
  deleted, one check added to an existing script and one README paragraph. No new dependency, no
  `package-lock.json` change (README warns a fresh resolve without the lockfile fails on a vite peer
  conflict).

Correct me at gate 1, otherwise I proceed with these.

## Context found

- `netlify.toml`: `[build]` (`npm run generate`, publish `dist`), `[build.environment]`
  (`NODE_VERSION = "24"`), one `[[headers]]` block for `/*` (X-Frame-Options, X-Content-Type-Options,
  Referrer-Policy) and the four `[[redirects]]` (lines 15-41) that never fire. The comment above them
  already states the intent this task preserves: no `force`, no catch-all, so the site's own files and
  its 404 page keep precedence.
- `nuxt.config.ts`: `SITE_URL = 'https://land.t2l.ink'`, modules `@nuxtjs/i18n` + `@nuxtjs/sitemap`,
  `nitro.prerender` with `crawlLinks: true`. **No `routeRules` today** — that is the alternative
  mechanism, evaluated and rejected below.
- `public/`: `robots.txt`, `favicon.png`, `apple-touch-icon.png` — the established place for static
  files that ship verbatim; `robots.txt` even carries the site host as a literal with a comment
  explaining why. `.gitignore` does not exclude `public/_redirects`.
- `scripts/check-links.mjs`: zero-dependency Node checker, criteria numbered 4-10, `pass()`/`fail()`/
  `warn()` into one report, non-zero exit on any FAIL. `resolveOutputDir()` already accepts
  `.output/public`, `dist` or an argument. Criterion 9 already reads a repo file
  (`repoRoot/public/robots.txt`) next to the generated one, so reading repo files is an established
  pattern here. Criterion 4's `APP_PATH_PREFIXES` is the canonical list of app paths.
- `app/data/links.ts` / `appUrl()`: every in-page link into the app is already absolute — the
  redirects are a safety net for **typed** URLs only, not a fix for site links.
- `README.md` lines 20-23, 37, 40-45 and 60-62 currently tell the reader the four 301s live in
  `netlify.toml`. That statement becomes wrong with this change.
- `nitropack@2.13.4` `presets/netlify/utils.mjs`, `presets/netlify/preset.mjs`, `presets/_static/preset.mjs`,
  `presets/_resolve.mjs` (read in the main checkout's `node_modules`): the evidence for every claim in
  Assumptions about what is written where.

## Approach

Declare the four rules in **`public/_redirects`**, a new static public asset, and delete the
`[[redirects]]` block from `netlify.toml`. Netlify reads `_redirects` first and takes the first match,
so the rules sit exactly where they are reached; Nitro's `writeRedirects` finds the file, keeps it, and
appends its own `/* /404.html 404` fallback **after** it, which preserves today's intent (no catch-all
of ours, the site's own pages and its 404 page keep precedence for everything else). The file is plain
Netlify syntax — `from`, `to`, `status`, `#` comments — so what the repo shows is literally what
Netlify executes, with no translation layer to reason about.

Rejected: **`nitro.routeRules` with `redirect`** in `nuxt.config.ts`. It works on Netlify (the same
`writeRedirects` prepends each rule above the fallback, mapping `/app/**` → `/app/*` and
`https://t2l.ink/app/**` → `.../:splat`), but it is invisible off Netlify: locally Nitro resolves the
plain `static` preset, `writeRedirects` never runs, and `npm run generate` produces **no `_redirects`
at all**. The acceptance the requester asked for — "after `npm run generate`, the check asserts the
generated `_redirects`" — would then only be runnable behind a `NITRO_PRESET` environment variable and
against a different output directory, which is precisely the kind of "works differently where you look
at it" that produced this bug. Rejected: **keeping the rules in `netlify.toml`**; with a static build
Nitro always emits a catch-all into `_redirects`, so they can never be reached — they are dead, and
leaving them would give the repo two competing mechanisms. Rejected: **a `/*` catch-all of our own in
`public/_redirects`** to force ordering; it would suppress Nitro's fallback (the `/^\/\* /m` early
return) and risks swallowing the site's own routes.

The check extends `scripts/check-links.mjs` rather than adding a script: same `npm run check:links`
command, same PASS/FAIL report, no new file. It parses the generated `_redirects` into rules (ignoring
blank lines and `#` comments), asserts the four expected rules are present in the required form and
that no catch-all rule (`/*` or `/**`) precedes any of them, and asserts the repo carries one mechanism
(`public/_redirects` declares no catch-all, `netlify.toml` declares no `[[redirects]]`). It tolerates
the catch-all being absent, because the local `static`-preset output legitimately has none.

## Files to change

| File | Change | Why |
|---|---|---|
| `public/_redirects` | **new**: the four 301 rules plus a comment block explaining the ordering, that Netlify reads this file before `netlify.toml`, that Nitro appends its `/* /404.html 404` after it, and that a `/*` line must never be added here | the only place Netlify reaches before its own generated catch-all |
| `netlify.toml` | remove the four `[[redirects]]` tables and their comment block (lines 15-41); leave `[build]`, `[build.environment]` and `[[headers]]` byte-identical; leave a one-line pointer to `public/_redirects` | they can never fire; one mechanism only |
| `scripts/check-links.mjs` | add criterion 11 (the four rules are in the generated `_redirects`, in the required form, none of them after a catch-all) and criterion 12 (`public/_redirects` has no catch-all of its own and `netlify.toml` declares no `[[redirects]]`), in the existing `pass`/`fail` style | the behaviour is asserted on every build, not assumed |
| `README.md` | lines 20-23, 37, 40-45 and 60-62: name `public/_redirects` as the home of the four 301s, say in one sentence why they cannot live in `netlify.toml`, and add the two new checks to the `check:links` description and `public/_redirects` to the Structure block | the doc must not point at the dead mechanism |

## Acceptance criteria

1. `public/_redirects` exists and declares exactly four redirect rules, in this order: `/login` → `https://t2l.ink/login` `301`; `/register` → `https://t2l.ink/register` `301`; `/welcome` → `https://t2l.ink/welcome` `301`; `/app/*` → `https://t2l.ink/app/:splat` `301`.
2. `public/_redirects` declares no rule whose source path is `/*` or `/**`.
3. `netlify.toml` contains no `[[redirects]]` table; its `[build]`, `[build.environment]` and `[[headers]]` blocks are unchanged (same keys, same values).
4. After `npm run generate` (plain, no `NITRO_PRESET`), `.output/public/_redirects` exists and contains the four rules of criterion 1 in that form.
5. After a clean `NITRO_PRESET=netlify-static npm run generate`, `dist/_redirects` contains the four rules of criterion 1 **followed by** the line `/* /404.html 404`, and no other rule.
6. `npm run check:links` reports a PASS line for the new redirect criterion on both outputs of criteria 4 and 5, and exits 0 with no FAIL line.
7. `npm run check:links` exits non-zero with a FAIL line naming the new criterion when the generated `_redirects` is edited so that one of the four rules is missing, its target host or status is wrong, or a `/*` catch-all line is moved above them.
8. `npm run check:links` exits non-zero with a FAIL line naming the new criterion when a `[[redirects]]` table is re-added to `netlify.toml` or a `/*` line is added to `public/_redirects`.
9. `npm run generate` completes without error, and every pre-existing check-links criterion (4-10) still passes — in particular criterion 8, the set of generated HTML files, is unchanged, so no page URL is added, removed or renamed.
10. On the PR's Netlify deploy preview, `curl -sI <preview>/login` returns `301` with `location: https://t2l.ink/login`; `curl -sI <preview>/welcome` returns `301` with `location: https://t2l.ink/welcome`.
11. On the deploy preview, `curl -sI "<preview>/register?x=1"` returns `301` with `location: https://t2l.ink/register?x=1` — the query string is preserved.
12. On the deploy preview, `curl -sI <preview>/app/abc` returns `301` with `location: https://t2l.ink/app/abc`.
13. On the deploy preview, `curl -si <preview>/does-not-exist` returns HTTP `404` and a body identical to the body of `curl -s <preview>/404.html` (the site's own generated 404 page, not Netlify's default not-found page).
14. On the deploy preview, `curl -sI <preview>/`, `curl -sI <preview>/de/` and `curl -sI <preview>/blog-articles/oceanmata-x-tap2link` each return `200`, and the response for `/` still carries `x-frame-options: DENY`, `x-content-type-options: nosniff` and `referrer-policy: strict-origin-when-cross-origin`.
15. The PR description contains the raw output of the curl commands behind criteria 10-14, with the deploy-preview host visible, plus the `dist/_redirects` content from criterion 5.
16. `README.md` names `public/_redirects` as the place the four 301s live, states why `netlify.toml` cannot carry them, and lists `public/_redirects` in the Structure block; no occurrence of "the four 301s" points at `netlify.toml` any more.

## Test plan

There is no automated test suite in this repo — the build plus `scripts/check-links.mjs` is the whole
mechanical net, and this task extends it. Run from the worktree root, in order:

```powershell
npm ci                                      # node_modules is absent here; never symlink it (README)
npm run generate                            # static preset -> .output/public
npm run check:links                         # criteria 4-10 plus the new 11 and 12; must exit 0
Get-Content .output/public/_redirects        # criterion 4

Remove-Item -Recurse -Force dist, .output -ErrorAction SilentlyContinue
$env:NITRO_PRESET = 'netlify-static'
npm run generate                            # Netlify's real preset -> dist/
Get-Content dist/_redirects                  # criterion 5: four rules, then /* /404.html 404
npm run check:links dist                     # the same checks against the Netlify-shaped output
Remove-Item Env:NITRO_PRESET
```

The Tester then proves criteria 7 and 8 by breaking the input on purpose (remove one rule from
`.output/public/_redirects`; move a `/* /404.html 404` line to the top; add a `[[redirects]]` table to
`netlify.toml`), re-running `npm run check:links`, confirming the non-zero exit and the FAIL line, and
restoring the files. Finally the Tester runs the curl block from "Verification and evidence" against
the PR's deploy preview and pastes the output into the PR description. A green `check:links` alone does
not close this task — the previous task passed without the behaviour ever being exercised, which is
how this bug shipped.

## What to click

1. Open `<preview>/login` in a browser: it lands on the app's login page and the URL bar reads `https://t2l.ink/login`, not the preview host.
2. Open `<preview>/app/abc`: it lands on `https://t2l.ink/app/abc`.
3. Open `<preview>/does-not-exist`: the site's own 404 page appears (Nuxt's built-in "Page not found"), not Netlify's generic not-found page with the Netlify logo.
4. Open `<preview>/` and `<preview>/de/`: the English and German home pages render unchanged — header, hero, footer, language switch.
5. Open `<preview>/blog-articles/oceanmata-x-tap2link` and click one header link and one footer link: normal in-site navigation still works and nothing bounces to `t2l.ink`.

## Verification and evidence

- **Root cause, before any change** (run once on the untouched branch, paste into the PR):
  `Remove-Item -Recurse -Force dist, .output -EA SilentlyContinue; $env:NITRO_PRESET='netlify-static'; npm run generate; Get-Content dist/_redirects`
  Expected: the single line `/* /404.html 404`. That is the rule that answers `/login` today and the
  reason the `netlify.toml` rules never run. If it prints anything else, stop (see Stop conditions).
- **Criterion 5, after the change**: the same command must print the four rules and then
  `/* /404.html 404`. Paste the file content into the PR.
- **Criteria 4, 6-9**: the `npm run check:links` report (the PASS/FAIL lines and the final
  `OK: n passed, 0 failed` line) for both the `.output/public` and the `dist` run, pasted into the PR.
- **Criteria 7 and 8**: the FAIL lines from the two deliberately broken runs, pasted into the PR, with
  one sentence saying the files were restored afterwards.
- **Criteria 10-14**, on the deploy preview (`https://deploy-preview-<n>--t2l-landing.netlify.app`) —
  quote the URLs in PowerShell, `?` and `&` are shell characters:
  ```powershell
  $p = 'https://deploy-preview-<n>--t2l-landing.netlify.app'
  curl.exe -sI "$p/login"
  curl.exe -sI "$p/register?x=1"
  curl.exe -sI "$p/welcome"
  curl.exe -sI "$p/app/abc"
  curl.exe -si "$p/does-not-exist" | Select-Object -First 20
  curl.exe -sI "$p/" ; curl.exe -sI "$p/de/" ; curl.exe -sI "$p/blog-articles/oceanmata-x-tap2link"
  ```
  The close-out must show the status line and the `location:` header for each of the four redirects,
  the `404` status plus the `<title>` of the returned body, the three `200`s, and the three security
  headers on `/`.
- **Baseline for criterion 14**: `curl.exe -sI https://land.t2l.ink/` on production. If the three
  security headers are already missing there, that is a pre-existing finding to report, not a
  regression caused by this task.
- Criterion 16 is verified by reading the diff of `README.md`.

## Will not do

- No `git checkout`, `rebase`, `merge` or `push` to `dev` or `main`; the PR targets `dev` and Christian
  merges `dev` into `main` for the production deploy.
- No changes in the Netlify UI: no domain settings, no DNS, no environment variables, no manual deploy,
  no deploy of `main`.
- No changes in any other repo (`tap2link-website`, `tap2link-app`, the backend, the load balancer,
  Google Cloud).
- No new npm dependency and no `package-lock.json` change; `npm ci` only.
- No new page, route or locale on the landing site — in particular no `/login` page here.
- No change to `[[headers]]` in `netlify.toml`, to `nuxt.config.ts`, to any page, component or content
  file, and no design or copy change (including the unbranded 404 page).
- No `routeRules` added to `nuxt.config.ts` — that is the rejected mechanism; adding it alongside
  `public/_redirects` would recreate the two-mechanism problem this task exists to remove.

## Stop conditions

- The "root cause, before any change" run prints something other than `/* /404.html 404` (for example
  nothing, or a file already containing the four rules): the diagnosis is wrong. Stop, paste the actual
  content, and ask before changing anything.
- After the change, `dist/_redirects` does not contain the four rules above the catch-all — for
  instance Nitro logs "Not adding Nitro fallback to `_redirects`" or overwrites the file. Stop and
  report the file plus the build log line; do not start layering a second mechanism on top.
- The deploy preview still answers 404 on `/login` although `dist/_redirects` is correct. Stop, paste
  the full response headers including `x-nf-request-id` and any `x-nf-*` forwarding headers, and ask —
  the next step would be a Netlify-side setting, which is out of scope here.
- `npm ci` wants to change `package-lock.json`, or the build fails with the worktree `node_modules`
  symlink error from README. Stop and report.
- Any pre-existing check-links criterion (4-10) starts failing. Stop; this task must not move the
  generated page set.
- Removing `[[redirects]]` turns out to drop the security headers on the preview while production still
  has them. Stop and report before merging.

## Risks and open questions

- `/app` without a trailing slash is **not** covered by `/app/*` and keeps 404ing. That is today's
  behaviour at parity, deliberately unchanged; if Christian wants it redirected it is one more line.
  The same holds for `/de/login`, `/de/welcome` and the API prefixes.
- Netlify's matching of `/login/` (trailing slash) and of case variants such as `/Login` is
  **unverified** — the brief names four exact paths and those are what is asserted. If the trailing-slash
  variant matters, it needs its own rule and its own curl line.
- The catch-all's position is only provable in the Netlify-shaped output. The plain local
  `npm run generate` legitimately has no catch-all, so criterion 4 is weaker than criterion 5 on
  purpose; the strong proof is the `NITRO_PRESET=netlify-static` run plus the deploy-preview curls.
- Every claim about the generator comes from reading `nitropack@2.13.4` in the main checkout's
  `node_modules`, and from the lockfile pin — not from a build in this session. A `^2.x` bump on
  Netlify could in principle change `writeRedirects`; the new check-links criterion is exactly the
  tripwire for that, and it runs on every build.
- The site's 404 page is Nuxt's built-in error page (no `app/error.vue`): unbranded, unlocalised, no
  header or footer. The brief only requires that it keeps working, so this task leaves it alone —
  worth its own task if Christian wants a branded 404.
- `README.md` claims `dist` is a symlink to `.output/public`. That is true only for a local build; on
  Netlify the `netlify-static` preset writes straight into `dist/`. Unverified and not corrected
  beyond the lines this task touches.
- Criterion 13 compares two response bodies from the same deploy. If Netlify ever serves a compressed
  or differently-processed body for one of the two, compare the `<title>` and the first heading
  instead, and say so in the close-out.

## Out of scope

- Any design or copy change, including a branded/localised 404 page.
- The app repos (`tap2link-website`, `tap2link-app`), the backend, Google Cloud, the load balancer and
  the `www.t2l.ink` / `t2l.ink` redirects that live there.
- Netlify domain settings, DNS and the production deploy itself.
- Adding redirects beyond the four named ones (`/app`, `/de/*` app paths, `/api/*`, `/auth-api/*`,
  `/contact-api/*`).
- Introducing a test runner or any automated test framework to this repo.
