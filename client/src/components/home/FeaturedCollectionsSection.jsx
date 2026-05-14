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
    accent: 'from-sky-500/90 to-cyan-600/90',
    params: { category: 'Laptops', sort: 'rating' },
  },
  {
    id: 'col-game',
    title: 'Battle-ready setups',
    subtitle: 'High-refresh panels · precision mice',
    accent: 'from-rose-600/90 to-orange-600/90',
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
    <section className="tn-section-y bg-white/70 dark:bg-tn-950/40">
      <div className="tn-container space-y-10">
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
                className="group relative block overflow-hidden rounded-tn-2xl border border-zinc-200/80 bg-zinc-50 p-8 shadow-tn-card transition hover:-translate-y-1 hover:border-sky-300/60 dark:border-white/10 dark:bg-tn-900/80 dark:hover:border-sky-400/30"
              >
                <div
                  className={`pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gradient-to-br ${col.accent} opacity-40 blur-3xl transition duration-500 group-hover:opacity-70`}
                  aria-hidden
                />
                <div className="relative space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600 dark:text-sky-300">
                    Shop the edit
                  </p>
                  <h3 className="text-2xl font-semibold text-zinc-900 dark:text-white">{col.title}</h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">{col.subtitle}</p>
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-sky-600 dark:text-sky-300">
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
