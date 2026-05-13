import { motion } from 'framer-motion'
import { heroContent } from '@/data/mockHomeFeed.js'
import { PrimaryButton } from '@/components/ui/PrimaryButton.jsx'
import { SecondaryButton } from '@/components/ui/SecondaryButton.jsx'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion.js'

export function HeroSection() {
  const reduceMotion = usePrefersReducedMotion()

  return (
    <section className="relative overflow-hidden tn-section-y">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute -left-40 top-0 h-96 w-96 rounded-full bg-indigo-600/35 blur-[140px] dark:bg-indigo-500/25" />
        <div className="absolute right-0 top-32 h-[28rem] w-[28rem] rounded-full bg-violet-600/30 blur-[150px] dark:bg-violet-500/20" />
        <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-cyan-500/15 blur-[100px]" />
      </div>

      <div className="tn-container relative grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center">
        <motion.div
          initial={reduceMotion ? undefined : { opacity: 0, y: 16 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-6"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-indigo-600 dark:text-indigo-300/90">
            {heroContent.eyebrow}
          </p>
          <h1 className="text-balance text-tn-display font-semibold tracking-tight text-zinc-900 dark:text-white">
            {heroContent.title}{' '}
            <span className="bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
              {heroContent.highlight}
            </span>
          </h1>
          <p className="max-w-xl text-tn-lead text-zinc-600 dark:text-zinc-400">
            {heroContent.description}
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <PrimaryButton to={heroContent.primaryCta.to}>
              {heroContent.primaryCta.label}
            </PrimaryButton>
            <SecondaryButton to={heroContent.secondaryCta.to}>
              {heroContent.secondaryCta.label}
            </SecondaryButton>
          </div>
          <dl className="grid gap-4 pt-4 sm:grid-cols-3">
            {heroContent.stats.map((item) => (
              <div
                key={item.label}
                className="rounded-tn-lg border border-zinc-200/80 bg-white/70 p-4 backdrop-blur dark:border-white/10 dark:bg-tn-850/70"
              >
                <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-500">
                  {item.label}
                </dt>
                <dd className="mt-1 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>
        </motion.div>

        <motion.div
          initial={reduceMotion ? undefined : { opacity: 0, y: 24 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div className="relative overflow-hidden rounded-tn-2xl border border-zinc-200/80 bg-gradient-to-br from-zinc-100 via-white to-zinc-100 p-1 shadow-tn-soft dark:border-white/10 dark:from-tn-900 dark:via-tn-850 dark:to-tn-900">
            <div className="rounded-tn-xl bg-zinc-950 p-6 text-zinc-100 dark:bg-gradient-to-br dark:from-tn-900 dark:to-tn-void">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-300/90">
                Live preview
              </p>
              <p className="mt-4 text-2xl font-semibold tracking-tight">Checkout-ready UI</p>
              <p className="mt-2 text-sm text-zinc-400">
                Modular sections, motion-safe defaults, and tokens tuned for a premium dark
                storefront.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {['Secure payments', 'Fast delivery', 'Wishlist sync', 'Admin-ready'].map(
                  (label) => (
                    <div
                      key={label}
                      className="rounded-tn border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-zinc-200"
                    >
                      {label}
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>
          <div className="pointer-events-none absolute -bottom-10 -right-6 h-40 w-40 rounded-full bg-indigo-500/30 blur-3xl" />
        </motion.div>
      </div>
    </section>
  )
}
