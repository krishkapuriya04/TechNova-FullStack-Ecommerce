/**
 * Central list of public storefront routes for sitemap generation (future: build script or edge function).
 * Paths are pathname-only (no origin).
 */
export const SITEMAP_PUBLIC_PATHS = [
  { path: '/', changefreq: 'weekly', priority: 1 },
  { path: '/shop', changefreq: 'daily', priority: 0.9 },
]
