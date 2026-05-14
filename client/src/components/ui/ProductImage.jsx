import { useMemo, useState } from 'react'

function hashGradient(seed) {
  const palettes = [
    'from-slate-800 via-slate-900 to-slate-950',
    'from-sky-900 via-slate-900 to-slate-950',
    'from-zinc-800 via-neutral-900 to-black',
    'from-slate-700 via-cyan-950 to-slate-950',
  ]
  let sum = 0
  const key = seed || 'p'
  for (let i = 0; i < key.length; i += 1) sum += key.charCodeAt(i)
  return palettes[sum % palettes.length]
}

export function ProductImage({
  src,
  alt,
  className = '',
  imgClassName = 'h-full w-full object-cover',
  aspectClassName = 'aspect-[4/3]',
  seed = '',
}) {
  const [failed, setFailed] = useState(false)
  const gradient = useMemo(() => hashGradient(`${seed}-${alt}`), [seed, alt])

  if (!src || failed) {
    return (
      <div
        className={`relative overflow-hidden bg-gradient-to-br ${gradient} ${aspectClassName} ${className}`}
        role="img"
        aria-label={alt || 'Product placeholder'}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(255,255,255,0.28),transparent_55%)]" />
      </div>
    )
  }

  return (
    <div className={`relative overflow-hidden bg-zinc-100 dark:bg-tn-950 ${aspectClassName} ${className}`}>
      <img
        src={src}
        alt={alt || ''}
        loading="lazy"
        decoding="async"
        onError={() => setFailed(true)}
        className={`${imgClassName} duration-500 ease-out group-hover:scale-[1.06] motion-safe:transition-transform`}
      />
    </div>
  )
}
