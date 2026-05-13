import { Helmet } from 'react-helmet-async'
import { getSiteOrigin, env } from '@/config/env.js'
import { SEO_DEFAULTS } from '@/constants/seoDefaults.js'

/**
 * Per-route SEO. `getSiteOrigin()` uses `VITE_APP_URL` or `window.location.origin`.
 */
export function Seo({ title, description = SEO_DEFAULTS.description, canonicalPath, ogImage, noindex = false }) {
  const origin = getSiteOrigin()
  const path =
    canonicalPath != null && canonicalPath !== ''
      ? canonicalPath.startsWith('/')
        ? canonicalPath
        : `/${canonicalPath}`
      : typeof window !== 'undefined'
        ? `${window.location.pathname}${window.location.search}`
        : '/'
  const canonical = origin ? `${origin}${path}` : undefined
  const image = ogImage ?? (origin ? `${origin}/favicon.svg` : '/favicon.svg')
  const heading = title ?? env.siteName

  return (
    <Helmet prioritizeSeoTags>
      {title ? <title>{title}</title> : null}
      <meta name="description" content={description} />
      {canonical ? <link rel="canonical" href={canonical} /> : null}
      {noindex ? <meta name="robots" content="noindex, nofollow" /> : <meta name="robots" content="index, follow" />}

      <meta property="og:site_name" content={env.siteName} />
      <meta property="og:title" content={heading} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={SEO_DEFAULTS.ogType} />
      {canonical ? <meta property="og:url" content={canonical} /> : null}
      <meta property="og:image" content={image} />

      <meta name="twitter:card" content={SEO_DEFAULTS.twitterCard} />
      <meta name="twitter:title" content={heading} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  )
}
