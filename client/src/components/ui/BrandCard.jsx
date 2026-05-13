import { motion } from 'framer-motion'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion.js'

export function BrandCard({ brand }) {
  const reduceMotion = usePrefersReducedMotion()

  return (
    <motion.div
      className="tn-surface-elevated flex flex-col justify-between gap-4 rounded-tn-xl p-6 tn-transition-base hover:border-indigo-300/40 dark:hover:border-indigo-400/25"
      whileHover={reduceMotion ? undefined : { y: -3 }}
      transition={{ type: 'spring', stiffness: 280, damping: 22 }}
    >
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
        Brand spotlight — swap for real logos when assets are ready.
      </p>
    </motion.div>
  )
}
