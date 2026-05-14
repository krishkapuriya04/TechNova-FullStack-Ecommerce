import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { SectionTitle } from '@/components/ui/SectionTitle.jsx'
import { ROUTES } from '@/constants/routes.js'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion.js'

const collections = [
  {
    id: 'col-creator',
    title: 'Creator workstations',
    subtitle: 'OLED laptops · color-accurate monitors',
    accent: 'from-teal-500/90 to-cyan-600/90',
    params: { category: 'Laptops', sort: 'rating' },
  },
  {
    id: 'col-game',
    title: 'Battle-ready setups',
    subtitle: 'High-refresh panels · precision mice',
    accent: 'from-zinc-700/90 via-slate-800/90 to-teal-700/90',
    params: { category: 'Gaming', sort: 'newest' },
  },
  {
    id: 'col-audio',
    title: 'Quiet everywhere',
    subtitle: 'ANC headphones · studio clarity',
    accent: 'from-emerald-500/90 to-teal-600/90',
    params: { category: 'Audio', featured: 'true' },
  },
]

function shopHref(params) {
  const qs = new URLSearchParams(params).toString()
  return qs ? `${ROUTES.SHOP}?${qs}` : ROUTES.SHOP
}

export function FeaturedCollectionsSection() {
  const reduceMotion = usePrefersReducedMotion()

  return (
    <section className="relative overflow-hidden tn-section-y">
      <div className="pointer-events-none absolute inset-0 bg-white/80 dark:bg-tn-950/50" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-teal-400/25 to-transparent" />
      <div className="tn-container relative space-y-10">
        <SectionTitle
          eyebrow="Collections"
          title="Featured edits"
          subtitle="Curated routes into the catalog — each card deep-links filters for instant merchandising."
        />
        <div className="grid gap-5 md:grid-cols-3">
          {collections.map((col, index) => (
            <motion.div
              key={col.id}
              initial={reduceMotion ? undefined : { opacity: 0, y: 14 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ delay: index * 0.05, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                to={shopHref(col.params)}
                className="group relative block overflow-hidden rounded-tn-3xl border border-zinc-200/70 bg-zinc-50/90 p-8 shadow-tn-card backdrop-blur-md transition hover:-translate-y-1 hover:border-teal-400/45 hover:shadow-tn-lift dark:border-white/[0.07] dark:bg-zinc-950/70 dark:hover:border-teal-400/30"
              >
                <div
                  className={`pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full bg-gradient-to-br ${col.accent} opacity-35 blur-3xl transition duration-500 group-hover:opacity-65`}
                  aria-hidden
                />
                <div className="relative space-y-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-teal-700 dark:text-teal-300">
                    Shop the edit
                  </p>
                  <h3 className="text-2xl font-semibold text-zinc-950 dark:text-white">{col.title}</h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">{col.subtitle}</p>
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-teal-700 dark:text-teal-300">
                    Explore collection
                    <span aria-hidden>→</span>
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
