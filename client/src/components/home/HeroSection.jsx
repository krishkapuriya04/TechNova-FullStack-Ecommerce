import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { heroContent } from '@/data/mockHomeFeed.js'
import { heroShowcaseDevices } from '@/constants/heroShowcase.js'
import { PrimaryButton } from '@/components/ui/PrimaryButton.jsx'
import { SecondaryButton } from '@/components/ui/SecondaryButton.jsx'
import { ProductImage } from '@/components/ui/ProductImage.jsx'
import { HeroShowcaseImage } from '@/components/home/HeroShowcaseImage.jsx'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion.js'
import { fetchProducts, isCancelledRequest } from '@/services/productService.js'
import { productPath, ROUTES } from '@/constants/routes.js'
import { formatCurrency } from '@/utils/formatCurrency.js'
import { getErrorMessage } from '@/utils/apiError.js'

export function HeroSection() {
  const reduceMotion = usePrefersReducedMotion()
  const [spotlights, setSpotlights] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [retryTick, setRetryTick] = useState(0)

  useEffect(() => {
    let active = true
    const controller = new AbortController()
    async function load() {
      setLoading(true)
      setError('')
      try {
        let payload = await fetchProducts(
          { featured: 'true', limit: '3', sort: 'rating' },
          { signal: controller.signal },
        )
        let products = payload.products ?? []
        if (products.length === 0) {
          payload = await fetchProducts(
            { limit: '3', sort: 'rating' },
            { signal: controller.signal },
          )
          products = payload.products ?? []
        }
        if (!active) return
        setSpotlights(products)
      } catch (err) {
        if (!active || isCancelledRequest(err)) return
        setSpotlights([])
        setError(getErrorMessage(err, 'Could not load staff picks'))
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => {
      active = false
      controller.abort()
    }
  }, [retryTick])

  return (
    <section className="relative overflow-hidden border-b border-zinc-200/60 bg-gradient-to-b from-white via-zinc-50 to-zinc-100 dark:border-white/[0.06] dark:from-tn-void dark:via-tn-950 dark:to-black tn-section-y">
      <div className="pointer-events-none absolute inset-0 tn-grid-faint opacity-60 dark:opacity-100" aria-hidden />
      <div
        className="pointer-events-none absolute inset-0 dark:tn-mesh-hero-dark tn-mesh-hero-light"
        aria-hidden
      />
      <motion.div
        className="pointer-events-none absolute -right-32 top-10 h-[28rem] w-[28rem] rounded-full bg-teal-400/15 blur-[120px] dark:bg-teal-500/12"
        aria-hidden
        animate={
          reduceMotion
            ? undefined
            : {
                opacity: [0.35, 0.55, 0.35],
                scale: [1, 1.06, 1],
              }
        }
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="pointer-events-none absolute -left-24 bottom-0 h-80 w-80 rounded-full bg-cyan-400/12 blur-[100px] dark:bg-cyan-500/10"
        aria-hidden
        animate={
          reduceMotion
            ? undefined
            : {
                x: [0, 16, 0],
                y: [0, -10, 0],
              }
        }
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="tn-container relative flex flex-col gap-14 lg:gap-16 xl:grid xl:grid-cols-[minmax(0,1fr)_minmax(0,1.08fr)] xl:items-center">
        <motion.div
          initial={reduceMotion ? undefined : { opacity: 0, y: 20 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="order-2 max-w-2xl space-y-8 xl:order-1"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-teal-700 dark:text-teal-300/95">
            {heroContent.eyebrow}
          </p>
          <h1 className="text-balance text-tn-display font-semibold tracking-tight text-zinc-950 dark:text-white">
            {heroContent.title}{' '}
            <span className="bg-gradient-to-r from-teal-500 via-cyan-400 to-teal-300 bg-clip-text text-transparent dark:from-teal-400 dark:via-cyan-300 dark:to-teal-200">
              {heroContent.highlight}
            </span>
          </h1>
          <p className="max-w-xl text-tn-lead leading-relaxed text-zinc-600 dark:text-zinc-400">
            {heroContent.description}
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <PrimaryButton to={heroContent.primaryCta.to}>{heroContent.primaryCta.label}</PrimaryButton>
            <SecondaryButton to={heroContent.secondaryCta.to}>{heroContent.secondaryCta.label}</SecondaryButton>
          </div>
          <dl className="grid gap-3 pt-1 sm:grid-cols-3">
            {heroContent.stats.map((item) => (
              <div
                key={item.label}
                className="rounded-tn-xl border border-zinc-200/80 bg-white/75 p-4 shadow-sm backdrop-blur-xl dark:border-white/[0.07] dark:bg-zinc-950/55"
              >
                <dt className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-500">
                  {item.label}
                </dt>
                <dd className="mt-1.5 text-sm font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>
        </motion.div>

        <div className="relative order-1 min-h-[20rem] sm:min-h-[24rem] xl:order-2 xl:min-h-[28rem]">
          <div
            className="absolute inset-0 -z-10 rounded-[2rem] bg-gradient-to-br from-teal-500/12 via-transparent to-cyan-500/10 blur-2xl dark:from-teal-500/8 dark:to-cyan-500/6"
            aria-hidden
          />

          <div className="relative mx-auto grid max-w-lg grid-cols-2 gap-3 sm:max-w-none sm:grid-cols-3 sm:gap-4 lg:max-w-none">
            {heroShowcaseDevices.map((item, idx) => (
              <motion.div
                key={item.key}
                initial={reduceMotion ? undefined : { opacity: 0, y: 32 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-5%' }}
                transition={{ delay: 0.07 * idx, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                animate={
                  reduceMotion
                    ? undefined
                    : {
                        y: [0, -6, 0],
                      }
                }
                className={[
                  'group relative',
                  idx === 0 ? 'col-span-2 sm:col-span-1' : '',
                  item.floatClass ?? '',
                ].join(' ')}
              >
                <Link
                  to={item.to}
                  className="block overflow-hidden rounded-tn-2xl border border-white/50 bg-white/55 shadow-tn-card backdrop-blur-2xl tn-transition-base hover:-translate-y-1 hover:border-teal-300/35 hover:shadow-tn-lift dark:border-white/[0.08] dark:bg-zinc-950/50 dark:hover:border-teal-400/25"
                >
                  <div className="relative aspect-[5/4] overflow-hidden">
                    <HeroShowcaseImage
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-cover tn-transition-transform duration-700 ease-out group-hover:scale-[1.07]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 border-t border-white/10 bg-black/25 p-4 backdrop-blur-md dark:bg-black/35">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-teal-200/95">
                        {item.title}
                      </p>
                      <p className="mt-1 text-sm font-medium text-white">{item.subtitle}</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={reduceMotion ? undefined : { opacity: 0, y: 18 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="relative mt-8 overflow-hidden rounded-tn-2xl border border-zinc-200/70 bg-white/80 p-5 shadow-tn-soft backdrop-blur-2xl dark:border-white/[0.07] dark:bg-zinc-950/65"
          >
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-teal-500/[0.06] via-transparent to-cyan-500/[0.05]" aria-hidden />
            <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-teal-700 dark:text-teal-300/90">
                  Staff picks
                </p>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  Live from your catalog — featured, top-rated highlights.
                </p>
              </div>
            </div>
            <div className="relative mt-4 grid gap-3 sm:grid-cols-3">
              {loading ? (
                <div className="col-span-full rounded-tn-xl border border-dashed border-zinc-300/90 px-4 py-8 text-center text-sm text-zinc-500 dark:border-white/12 dark:text-zinc-400">
                  <span className="inline-block h-4 w-4 animate-pulse rounded-full bg-teal-500/40 align-middle" />{' '}
                  Loading staff picks…
                </div>
              ) : error ? (
                <div className="col-span-full space-y-3 rounded-tn-xl border border-amber-500/30 bg-amber-500/10 px-4 py-6 text-center text-sm text-amber-950 dark:text-amber-100">
                  <p>{error}</p>
                  <SecondaryButton type="button" size="sm" onClick={() => setRetryTick((t) => t + 1)}>
                    Retry
                  </SecondaryButton>
                </div>
              ) : spotlights.length ? (
                spotlights.map((p, idx) => {
                  const img = p.images?.[0]
                  const price =
                    p.discountPrice && p.discountPrice < p.price ? p.discountPrice : p.effectivePrice ?? p.price
                  return (
                    <motion.div
                      key={p.id}
                      initial={reduceMotion ? undefined : { opacity: 0, y: 10 }}
                      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.05 * idx, duration: 0.4 }}
                    >
                      <Link
                        to={productPath(p.slug)}
                        className="group flex items-center gap-3 rounded-tn-xl border border-zinc-200/70 bg-zinc-50/80 p-3 tn-transition-base hover:border-teal-400/40 hover:bg-white hover:shadow-md dark:border-white/[0.06] dark:bg-black/30 dark:hover:border-teal-400/30"
                      >
                        <ProductImage
                          src={img}
                          alt={p.title}
                          seed={p.slug}
                          aspectClassName="h-14 w-[4.5rem] shrink-0 rounded-tn"
                          className="rounded-tn ring-1 ring-black/5 dark:ring-white/10"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-zinc-900 dark:text-white">{p.title}</p>
                          <p className="text-xs text-zinc-500 dark:text-zinc-400">
                            {p.brand} · {p.category}
                          </p>
                          <p className="mt-0.5 text-sm font-semibold tabular-nums text-teal-700 dark:text-teal-300">
                            {formatCurrency(price)}
                          </p>
                        </div>
                      </Link>
                    </motion.div>
                  )
                })
              ) : (
                <div className="col-span-full rounded-tn-xl border border-dashed border-zinc-300/90 px-4 py-8 text-center text-sm text-zinc-500 dark:border-white/12 dark:text-zinc-400">
                  <p>Catalog is warming up.</p>
                  <Link
                    to={ROUTES.SHOP}
                    className="mt-2 inline-block text-sm font-semibold text-teal-700 dark:text-teal-300"
                  >
                    Browse the shop →
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
