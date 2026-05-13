import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { SectionTitle } from '@/components/ui/SectionTitle.jsx'
import { PrimaryButton } from '@/components/ui/PrimaryButton.jsx'
import { ROUTES } from '@/constants/routes.js'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion.js'

export function GamingShowcaseSection() {
  const reduceMotion = usePrefersReducedMotion()

  return (
    <section className="relative overflow-hidden tn-section-y">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-fuchsia-600/15 via-transparent to-indigo-600/20 dark:from-fuchsia-500/10 dark:to-indigo-500/10" />
      <div className="tn-container relative grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <motion.div
          initial={reduceMotion ? undefined : { opacity: 0, y: 16 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-5"
        >
          <SectionTitle
            eyebrow="Gaming lab"
            title="Frame-perfect battlestations"
            subtitle="High-refresh monitors, ultra-light mice, and handhelds that keep you in the flow — merchandised as a real startup category hub."
          />
          <div className="flex flex-wrap gap-3">
            <PrimaryButton to={`${ROUTES.SHOP}?category=Gaming&sort=rating`}>Shop gaming</PrimaryButton>
            <Link
              to={`${ROUTES.SHOP}?category=Monitors&sort=price_desc`}
              className="inline-flex items-center justify-center rounded-tn border border-zinc-200 px-5 py-2.5 text-sm font-semibold text-zinc-800 transition hover:border-indigo-300 dark:border-white/10 dark:text-zinc-100 dark:hover:border-indigo-400/40"
            >
              OLED monitors
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={reduceMotion ? undefined : { opacity: 0, y: 20 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.55, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-tn-2xl border border-zinc-200/80 bg-zinc-950 p-8 text-white shadow-tn-soft dark:border-white/10"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.35),transparent_55%)]" />
          <div className="relative grid gap-4 sm:grid-cols-2">
            {[
              { k: 'Latency', v: '4K Hz ready mice' },
              { k: 'Immersion', v: 'QD-OLED panels' },
              { k: 'Audio', v: 'Spatial headsets' },
              { k: 'Portable', v: 'Handheld AAA' },
            ].map((row) => (
              <div key={row.k} className="rounded-tn border border-white/10 bg-white/5 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-indigo-200">{row.k}</p>
                <p className="mt-2 text-sm text-zinc-100">{row.v}</p>
              </div>
            ))}
          </div>
          <p className="relative mt-6 text-xs text-zinc-400">
            Showcase styling only — inventory still resolves from your MongoDB catalog.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
