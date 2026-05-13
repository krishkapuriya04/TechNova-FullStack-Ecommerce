import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion.js'

export function CategoryCard({ category }) {
  const reduceMotion = usePrefersReducedMotion()

  return (
    <motion.div
      whileHover={reduceMotion ? undefined : { y: -4 }}
      transition={{ type: 'spring', stiffness: 320, damping: 24 }}
    >
      <Link
        to={category.to}
        className="tn-surface group relative block overflow-hidden rounded-tn-xl p-6 tn-glow-ring tn-transition-base hover:border-indigo-300/50 dark:hover:border-indigo-400/30"
      >
        <div
          className={`pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gradient-to-br ${category.accent} opacity-40 blur-3xl transition duration-500 group-hover:opacity-70`}
          aria-hidden
        />
        <div className="relative space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Shop
          </p>
          <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">
            {category.title}
          </h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">{category.description}</p>
          <span className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 dark:text-indigo-300">
            Explore
            <span aria-hidden>→</span>
          </span>
        </div>
      </Link>
    </motion.div>
  )
}
