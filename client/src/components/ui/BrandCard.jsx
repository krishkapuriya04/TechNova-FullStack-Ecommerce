import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion.js'

export function BrandCard({ brand }) {
  const reduceMotion = usePrefersReducedMotion()
  const inner = (
    <>
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-tn bg-gradient-to-br from-indigo-500 to-violet-600 text-sm font-bold text-white shadow-tn-glow-sm">
          {brand.name.slice(0, 1)}
        </span>
        <div>
          <p className="text-sm font-semibold text-zinc-900 dark:text-white">{brand.name}</p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">{brand.tagline}</p>
        </div>
      </div>
      <p className="text-xs text-zinc-500 dark:text-zinc-500">
        Tap through to a live filtered catalog — swap in SVG marks when brand kits arrive.
      </p>
    </>
  )

  const surfaceClass =
    'tn-surface-elevated flex h-full flex-col justify-between gap-4 rounded-tn-xl p-6 tn-transition-base hover:border-indigo-300/40 dark:hover:border-indigo-400/25'

  return (
    <motion.div
      whileHover={reduceMotion ? undefined : { y: -3 }}
      transition={{ type: 'spring', stiffness: 280, damping: 22 }}
    >
      {brand.to ? (
        <Link to={brand.to} className={`${surfaceClass} tn-glow-ring group block`}>
          {inner}
        </Link>
      ) : (
        <div className={`${surfaceClass} tn-glow-ring`}>{inner}</div>
      )}
    </motion.div>
  )
}
