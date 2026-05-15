import { useMemo, useState } from 'react'
import { resolveProductImage } from '@/utils/productImages.js'

function hashGradient(seed) {
  const palettes = [
    'from-zinc-800 via-zinc-900 to-zinc-950',
    'from-teal-950 via-zinc-900 to-black',
    'from-zinc-800 via-neutral-900 to-black',
    'from-slate-800 via-cyan-950 to-black',
  ]
  let sum = 0
  const key = seed || 'p'
  for (let i = 0; i < key.length; i += 1) sum += key.charCodeAt(i)
  return palettes[sum % palettes.length]
}

function ProductImageFrame({
  resolvedSrc,
  fallbackSrc,
  alt,
  className,
  imgClassName,
  aspectClassName,
  gradient,
}) {
  const [activeSrc, setActiveSrc] = useState(resolvedSrc)
  const [failed, setFailed] = useState(false)
  const [loaded, setLoaded] = useState(false)

  if (failed) {
    return (
      <div
        className={`relative overflow-hidden bg-gradient-to-br ${gradient} ${aspectClassName} ${className}`}
        role="img"
        aria-label={alt || 'Product placeholder'}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_0%,rgba(255,255,255,0.26),transparent_55%)]" />
        <div className="absolute inset-0 ring-1 ring-inset ring-white/10" />
      </div>
    )
  }

  return (
    <div
      className={`relative overflow-hidden bg-zinc-100 ring-1 ring-inset ring-black/[0.04] dark:bg-tn-950 dark:ring-white/[0.05] ${aspectClassName} ${className}`}
    >
      {!loaded ? (
        <div
          className="tn-shimmer absolute inset-0 z-[1] bg-gradient-to-br from-zinc-200/90 via-zinc-100/80 to-zinc-200/90 dark:from-zinc-800 dark:via-zinc-900 dark:to-zinc-800"
          aria-hidden
        />
      ) : null}
      <img
        src={activeSrc}
        alt={alt || ''}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => {
          if (activeSrc !== fallbackSrc) {
            setActiveSrc(fallbackSrc)
            setLoaded(false)
            return
          }
          setFailed(true)
        }}
        className={`${imgClassName} duration-700 ease-out motion-safe:transition-[transform,opacity] ${
          loaded ? 'opacity-100 group-hover:scale-[1.05]' : 'scale-[1.02] opacity-0'
        }`}
      />
    </div>
  )
}

export function ProductImage({
  src,
  alt,
  className = '',
  imgClassName = 'h-full w-full object-cover',
  aspectClassName = 'aspect-[4/3]',
  seed = '',
}) {
  const resolvedSrc = useMemo(() => resolveProductImage(src, seed), [src, seed])
  const fallbackSrc = useMemo(() => resolveProductImage(null, seed), [seed])
  const gradient = useMemo(() => hashGradient(`${seed}-${alt}`), [seed, alt])

  return (
    <ProductImageFrame
      key={resolvedSrc}
      resolvedSrc={resolvedSrc}
      fallbackSrc={fallbackSrc}
      alt={alt}
      className={className}
      imgClassName={imgClassName}
      aspectClassName={aspectClassName}
      gradient={gradient}
    />
  )
}
