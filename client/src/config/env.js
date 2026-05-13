/**
 * Vite client environment. Only `VITE_*` keys are exposed to the browser bundle.
 *
 * Production (Vercel / static host):
 *   VITE_API_BASE_URL=https://your-api.onrender.com/api/v1
 *   VITE_APP_URL=https://your-app.vercel.app
 *
 * Development: leave defaults — Vite proxies `/api` to the backend (see vite.config.js).
 */
function trimSlash(s) {
  return s.replace(/\/+$/, '')
}

const rawApi = (import.meta.env.VITE_API_BASE_URL ?? '/api/v1').trim()
const rawApp = (import.meta.env.VITE_APP_URL ?? '').trim()

export const env = {
  apiBaseUrl: trimSlash(rawApi) || '/api/v1',
  /** Public site URL for canonical / OG (falls back to window.location.origin in the browser). */
  appUrl: trimSlash(rawApp),
  siteName: (import.meta.env.VITE_SITE_NAME ?? 'TechNova').trim(),
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
}

export function getSiteOrigin() {
  if (env.appUrl) return env.appUrl
  if (typeof window !== 'undefined') return window.location.origin
  return ''
}
