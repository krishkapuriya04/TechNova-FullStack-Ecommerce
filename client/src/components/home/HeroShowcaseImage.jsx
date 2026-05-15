import { useState } from 'react'
import { resolveProductImage } from '@/utils/productImages.js'

export function HeroShowcaseImage({ src, alt, className = '' }) {
  const primary = resolveProductImage(src, alt)
  const fallback = resolveProductImage(null, alt)
  const [activeSrc, setActiveSrc] = useState(primary)

  return (
    <img
      src={activeSrc}
      alt={alt}
      loading="eager"
      decoding="async"
      onError={() => {
        if (activeSrc !== fallback) setActiveSrc(fallback)
      }}
      className={className}
    />
  )
}
