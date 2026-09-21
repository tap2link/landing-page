// External links taken verbatim from the previous live site's HTML (2026-09-06).

/**
 * The app's host. The marketing site is served from its own host (land.t2l.ink, SITE_URL in
 * nuxt.config.ts), so every link into the app must be absolute - a relative /login or /welcome
 * would stay on the landing host and 404. Declared once here; change the host in this one place.
 */
export const APP_BASE_URL = 'https://t2l.ink'

/** Absolute URL of an app path, e.g. appUrl('/welcome') -> https://t2l.ink/welcome */
export function appUrl(path: string): string {
  return `${APP_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`
}

export const LINKS = {
  /** header "Log in" button - the live header links to /welcome, not /login */
  login: appUrl('/welcome'),
  /** "Get started" buttons on the pricing page */
  getStarted: appUrl('/welcome'),
  appStore: 'https://apps.apple.com/pl/app/tap2link/id1621577211',
  googlePlay: 'https://play.google.com/store/apps/details?id=ink.t2l.tap2link&hl=en_AU&gl=US',
  /** desktop nav "Shop" on the live site points at this Amazon listing (the shop.t2l.ink domain is dead) */
  amazonShop:
    'https://www.amazon.de/Digitale-Visitenkarte-Abyss-Blue-QR-Code/dp/B0BNL4L1H4/ref=sr_1_4?__mk_de_DE=%C3%85M%C3%85%C5%BD%C3%95%C3%91&crid=3LQP26XDVQ5FM&keywords=digitale%2Bvisitenkarte&s=officeproduct&sr=1-4&th=1',
  /** "Schedule demo" on /for-business */
  scheduleDemo:
    'https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ1a8u2CH9fktr_JlCYmIxKsp8Ut_yQL00jIXkQqqtiRNH1Nkv1cM73nw8Cdm_6ldxRT_bmrEuB_',
  /** "Watch video" on /agro-solutions */
  agroVideo: 'https://www.youtube.com/watch?v=KDjCIcNhNI4',
  instagram: 'https://www.instagram.com/t2l.ink/',
  linkedin: 'https://www.linkedin.com/company/tap2link',
  facebook: 'https://www.facebook.com/tap2link/',
  supportEmail: 'support@t2l.ink',
  contactEmail: 'contact@t2l.ink'
} as const
