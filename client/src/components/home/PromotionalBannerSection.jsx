import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { promoBanner } from '@/data/mockHomeFeed.js'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion.js'

export function PromotionalBannerSection() {
  const reduceMotion = usePrefersReducedMotion()

  return (
    <section className="tn-container tn-section-y">
      <motion.div
        initial={reduceMotion ? undefined : { opacity: 0, y: 12 }}
        whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-12%' }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-tn-2xl border border-indigo-500/25 bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 p-[1px] shadow-tn-glow-sm dark:shadow-tn-glow"
      >
        <div className="relative flex flex-col gap-6 rounded-tn-2xl bg-tn-950/90 px-6 py-10 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between sm:px-10">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(255,255,255,0.12),transparent_45%)]" />
          <div className="relative max-w-xl space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-indigo-200/90">
              {promoBanner.badge}
            </p>
            <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              {promoBanner.title}
            </h2>
            <p className="text-sm text-indigo-100/90">{promoBanner.subtitle}</p>
          </div>
          <div className="relative shrink-0">
            <Link
              to={promoBanner.cta.to}
              className="inline-flex items-center justify-center rounded-tn bg-white px-5 py-2.5 text-sm font-semibold text-indigo-700 shadow-lg tn-transition-base hover:brightness-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {promoBanner.cta.label}
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
