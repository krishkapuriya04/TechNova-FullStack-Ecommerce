import { useMemo, useState } from 'react'

function hashGradient(seed) {
  const palettes = [
    'from-indigo-600 via-violet-600 to-fuchsia-500',
    'from-slate-700 via-zinc-800 to-zinc-900',
    'from-sky-600 via-blue-700 to-indigo-800',
    'from-amber-500 via-orange-600 to-rose-600',
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
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(255,255,255,0.35),transparent_55%)]" />
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
        className={`${imgClassName} transition duration-300 ease-out group-hover:scale-[1.04]`}
      />
    </div>
  )
}
