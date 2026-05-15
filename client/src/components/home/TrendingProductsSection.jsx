import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchProducts, isCancelledRequest } from '@/services/productService.js'
import { SectionTitle } from '@/components/ui/SectionTitle.jsx'
import { ProductCard } from '@/components/ui/ProductCard.jsx'
import { ProductGridSkeleton } from '@/components/ui/LoadingSkeleton.jsx'
import { ProductCarousel, ProductCarouselItem } from '@/components/home/ProductCarousel.jsx'
import { SecondaryButton } from '@/components/ui/SecondaryButton.jsx'
import { getErrorMessage } from '@/utils/apiError.js'
import { ROUTES } from '@/constants/routes.js'

export function TrendingProductsSection() {
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState([])
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
          { trending: 'true', limit: '12', sort: 'rating' },
          { signal: controller.signal },
        )
        let list = payload.products ?? []
        if (list.length === 0) {
          payload = await fetchProducts(
            { limit: '12', sort: 'rating' },
            { signal: controller.signal },
          )
          list = payload.products ?? []
        }
        if (!active) return
        setProducts(list)
      } catch (err) {
        if (!active || isCancelledRequest(err)) return
        setProducts([])
        setError(getErrorMessage(err, 'Could not load trending products'))
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
    <section className="relative overflow-hidden tn-section-y">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-zinc-50/90 via-white to-zinc-100/80 dark:from-tn-950 dark:via-black/80 dark:to-tn-void" aria-hidden />
      <div
        className="pointer-events-none absolute -right-24 top-1/4 h-72 w-72 rounded-full bg-teal-500/10 blur-[100px] dark:bg-teal-500/15"
        aria-hidden
      />
      <div className="tn-container relative space-y-8">
        <SectionTitle
          eyebrow="Trending"
          title="What the community is buying"
          subtitle="Live trending flags from MongoDB — ideal for homepage carousels and campaign landings."
        />
        {error ? (
          <div className="space-y-3 rounded-tn-xl border border-amber-500/30 bg-amber-500/10 px-4 py-4 text-sm text-amber-950 dark:text-amber-100">
            <p>{error}</p>
            <SecondaryButton type="button" size="sm" onClick={() => setRetryTick((t) => t + 1)}>
              Retry
            </SecondaryButton>
          </div>
        ) : null}
        {loading ? (
          <ProductGridSkeleton count={4} />
        ) : products.length === 0 && !error ? (
          <div className="rounded-tn-2xl border border-dashed border-zinc-300/90 bg-white/70 px-6 py-10 text-center text-sm text-zinc-600 shadow-inner dark:border-white/12 dark:bg-zinc-950/50 dark:text-zinc-400">
            <p>Products will appear here once the catalog is seeded.</p>
            <Link
              to={ROUTES.SHOP}
              className="mt-2 inline-block text-sm font-semibold text-teal-700 dark:text-teal-300"
            >
              Explore the shop →
            </Link>
          </div>
        ) : !error ? (
          <ProductCarousel className="px-0.5">
            {products.map((product) => (
              <ProductCarouselItem key={product.id}>
                <ProductCard product={product} detailSlug={product.slug} />
              </ProductCarouselItem>
            ))}
          </ProductCarousel>
        ) : null}
      </div>
    </section>
  )
}
