import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { heroContent } from '@/data/mockHomeFeed.js'
import { heroShowcaseDevices } from '@/constants/heroShowcase.js'
import { PrimaryButton } from '@/components/ui/PrimaryButton.jsx'
import { SecondaryButton } from '@/components/ui/SecondaryButton.jsx'
import { ProductImage } from '@/components/ui/ProductImage.jsx'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion.js'
import { fetchProducts, isCancelledRequest } from '@/services/productService.js'
import { productPath } from '@/constants/routes.js'
import { formatCurrency } from '@/utils/formatCurrency.js'

export function HeroSection() {
  const reduceMotion = usePrefersReducedMotion()
  const [spotlights, setSpotlights] = useState([])

  useEffect(() => {
    let active = true
    const controller = new AbortController()
    async function load() {
      try {
        const payload = await fetchProducts(
          { featured: 'true', limit: '3', sort: 'rating' },
          { signal: controller.signal },
        )
        if (active) setSpotlights(payload.products ?? [])
      } catch (err) {
        if (!active || isCancelledRequest(err)) return
        setSpotlights([])
      }
    }
    load()
    return () => {
      active = false
      controller.abort()
    }
  }, [])

  return (
    <section className="relative overflow-hidden border-b border-zinc-200/80 bg-gradient-to-b from-white via-zinc-50 to-zinc-100 dark:border-white/5 dark:from-tn-void dark:via-tn-950 dark:to-slate-950 tn-section-y">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgb(14_165_233/0.12),transparent)] dark:bg-[radial-gradient(ellipse_70%_45%_at_50%_-10%,rgb(56_189_248/0.14),transparent)]" />
        <motion.div
          className="absolute -right-24 top-20 h-[22rem] w-[22rem] rounded-full bg-sky-400/20 blur-[120px] dark:bg-sky-500/12"
          animate={
            reduceMotion
              ? undefined
              : {
                  opacity: [0.35, 0.55, 0.35],
                  scale: [1, 1.05, 1],
                }
          }
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -left-32 bottom-0 h-72 w-72 rounded-full bg-cyan-500/15 blur-[100px] dark:bg-cyan-400/10"
          animate={
            reduceMotion
              ? undefined
              : {
                  x: [0, 12, 0],
                  y: [0, -8, 0],
                }
          }
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="tn-container relative grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-center lg:gap-16">
        <motion.div
          initial={reduceMotion ? undefined : { opacity: 0, y: 18 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-8"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-700 dark:text-sky-300/95">
            {heroContent.eyebrow}
          </p>
          <h1 className="text-balance text-tn-display font-semibold tracking-tight text-zinc-900 dark:text-white">
            {heroContent.title}{' '}
            <span className="bg-gradient-to-r from-sky-500 via-cyan-400 to-sky-300 bg-clip-text text-transparent dark:from-sky-400 dark:via-cyan-300 dark:to-sky-200">
              {heroContent.highlight}
            </span>
          </h1>
          <p className="max-w-xl text-tn-lead text-zinc-600 dark:text-zinc-400">{heroContent.description}</p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <PrimaryButton to={heroContent.primaryCta.to}>{heroContent.primaryCta.label}</PrimaryButton>
            <SecondaryButton to={heroContent.secondaryCta.to}>{heroContent.secondaryCta.label}</SecondaryButton>
          </div>
          <dl className="grid gap-4 pt-2 sm:grid-cols-3">
            {heroContent.stats.map((item) => (
              <div
                key={item.label}
                className="rounded-tn-lg border border-zinc-200/90 bg-white/80 p-4 shadow-sm backdrop-blur dark:border-white/10 dark:bg-slate-950/50"
              >
                <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-500">
                  {item.label}
                </dt>
                <dd className="mt-1 text-sm font-semibold text-zinc-900 dark:text-zinc-100">{item.value}</dd>
              </div>
            ))}
          </dl>
        </motion.div>

        <div className="relative min-h-[22rem] lg:min-h-[28rem]">
          <div className="absolute inset-0 -z-10 rounded-[2rem] bg-gradient-to-br from-sky-500/10 via-transparent to-cyan-500/10 blur-2xl dark:from-sky-500/5 dark:to-cyan-500/5" aria-hidden />

          <div className="relative mx-auto grid max-w-lg grid-cols-2 gap-4 sm:max-w-none sm:grid-cols-3 lg:max-w-none">
            {heroShowcaseDevices.map((item, idx) => (
              <motion.div
                key={item.key}
                initial={reduceMotion ? undefined : { opacity: 0, y: 28 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-5%' }}
                transition={{ delay: 0.08 * idx, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className={[
                  'group relative',
                  idx === 0 ? 'col-span-2 sm:col-span-1' : '',
                  item.floatClass ?? '',
                ].join(' ')}
              >
                <Link
                  to={item.to}
                  className="block overflow-hidden rounded-tn-2xl border border-white/40 bg-white/60 shadow-tn-card backdrop-blur-xl tn-transition-transform hover:-translate-y-1 dark:border-white/10 dark:bg-slate-950/55"
                >
                  <div className="relative aspect-[5/4] overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="eager"
                      decoding="async"
                      className="h-full w-full object-cover tn-transition-transform duration-500 ease-out group-hover:scale-[1.06]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/10 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-200/90">{item.title}</p>
                      <p className="mt-1 text-sm font-medium text-white">{item.subtitle}</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={reduceMotion ? undefined : { opacity: 0, y: 16 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.25, duration: 0.5 }}
            className="relative mt-10 overflow-hidden rounded-tn-2xl border border-zinc-200/90 bg-white/85 p-5 shadow-tn-soft backdrop-blur-xl dark:border-white/10 dark:bg-tn-900/70"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700 dark:text-sky-300/90">
                  Staff picks
                </p>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  Live from MongoDB — featured, top-rated catalog highlights.
                </p>
              </div>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {spotlights.length ? (
                spotlights.map((p, idx) => {
                  const img = p.images?.[0]
                  const price =
                    p.discountPrice && p.discountPrice < p.price ? p.discountPrice : p.effectivePrice ?? p.price
                  return (
                    <motion.div
                      key={p.id}
                      initial={reduceMotion ? undefined : { opacity: 0, y: 8 }}
                      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.05 * idx, duration: 0.4 }}
                    >
                      <Link
                        to={productPath(p.slug)}
                        className="group flex items-center gap-3 rounded-tn-lg border border-zinc-200/80 bg-zinc-50/80 p-3 tn-transition-base hover:border-sky-300/50 hover:bg-white dark:border-white/10 dark:bg-slate-950/60 dark:hover:border-sky-500/30"
                      >
                        <ProductImage
                          src={img}
                          alt={p.title}
                          seed={p.slug}
                          aspectClassName="h-14 w-[4.5rem] shrink-0 rounded-tn"
                          className="rounded-tn"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-zinc-900 dark:text-white">{p.title}</p>
                          <p className="text-xs text-zinc-500 dark:text-zinc-400">
                            {p.brand} · {p.category}
                          </p>
                          <p className="mt-0.5 text-sm font-semibold text-sky-700 dark:text-sky-300">
                            {formatCurrency(price)}
                          </p>
                        </div>
                      </Link>
                    </motion.div>
                  )
                })
              ) : (
                <div className="col-span-full rounded-tn border border-dashed border-zinc-300/80 px-4 py-6 text-center text-sm text-zinc-500 dark:border-white/15 dark:text-zinc-400">
                  Loading featured picks…
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
