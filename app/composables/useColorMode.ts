// Light/dark switch, shared across every `*.t2l.ink` host (T2L-6-D10): light by default, a
// persisted override once the visitor toggles it - never the OS/browser `prefers-color-scheme`
// setting (T2L-7-D17). The cookie name, value format and `.t2l.ink` domain mirror
// `tap2link-website`'s own `composables/useColorMode.ts` (T2L-6-S1, branch
// `feature/design-token-base-theme-system-from-harbor-light`) byte for byte, so a choice made on
// this site carries over to `t2l.ink`/`land.t2l.ink` and back, and vice versa.
//
// This site is fully prerendered (T2L-6-D12): there is no per-request server to read the cookie
// from, so the mode is resolved entirely in the browser. The attribute this composable sets on
// `<html>` (`data-color-mode`) is the same selector `tap2link-website`'s own generated
// `design-tokens/output/tokens.css` already uses for a consumer without Vuetify - this repo is
// exactly that consumer (see `app/assets/css/main.css`). A synchronous inline script
// (`nuxt.config.ts`) sets the same attribute before first paint so a returning visitor's override
// never flashes the other mode; this composable keeps it in sync afterwards and lets
// `AppHeader.vue`'s toggle change it.

export const COLOR_MODE_COOKIE = 't2l-color-mode'
export const COLOR_MODE_ATTR = 'data-color-mode'

export type ColorMode = 'light' | 'dark'

const isColorMode = (value: unknown): value is ColorMode => value === 'light' || value === 'dark'

function readCookie(): ColorMode | null {
  if (typeof document === 'undefined') return null
  // Mirrors the pre-paint script's own guard (nuxt.config.ts): document.cookie access can throw
  // in a handful of restrictive contexts, and decodeURIComponent throws on a malformed percent
  // escape - either failure falls back to null (light, the default) instead of interrupting
  // hydration/the composable's setup.
  try {
    const match = document.cookie.match(/(?:^|;\s*)t2l-color-mode=([^;]*)/)
    const value = match ? decodeURIComponent(match[1]!) : null
    return isColorMode(value) ? value : null
  } catch {
    return null
  }
}

function cookieDomain(): string | undefined {
  if (typeof window === 'undefined') return undefined
  const { hostname } = window.location
  return hostname === 't2l.ink' || hostname.endsWith('.t2l.ink') ? '.t2l.ink' : undefined
}

function writeCookie(mode: ColorMode) {
  if (typeof document === 'undefined') return
  const domain = cookieDomain()
  const maxAge = 60 * 60 * 24 * 365
  document.cookie = `${COLOR_MODE_COOKIE}=${mode}; Max-Age=${maxAge}; Path=/; SameSite=Lax${domain ? `; Domain=${domain}` : ''}`
}

function applyAttr(mode: ColorMode) {
  if (typeof document === 'undefined') return
  document.documentElement.setAttribute(COLOR_MODE_ATTR, mode)
}

export const useColorMode = () => {
  // useState, not a plain module-level ref: shared across every component instance on the page
  // without re-reading the cookie on each call.
  const stored = useState<ColorMode | null>('t2l-color-mode-stored', () => null)

  const colorMode = computed<ColorMode>(() => stored.value ?? 'light')
  const hasExplicitOverride = computed(() => isColorMode(stored.value))

  if (import.meta.client) {
    stored.value = readCookie()
    applyAttr(colorMode.value)

    watch(colorMode, (mode) => applyAttr(mode))
  }

  const setColorMode = (mode: ColorMode) => {
    stored.value = mode
    writeCookie(mode)
  }

  const toggleColorMode = () => setColorMode(colorMode.value === 'dark' ? 'light' : 'dark')

  return { colorMode, hasExplicitOverride, setColorMode, toggleColorMode }
}
