import { useEffect, useState } from 'react'
import { fetchProducts, isCancelledRequest } from '@/services/productService.js'
import { SectionTitle } from '@/components/ui/SectionTitle.jsx'
import { ProductCard } from '@/components/ui/ProductCard.jsx'
import { ProductGridSkeleton } from '@/components/ui/LoadingSkeleton.jsx'
import { ProductCarousel, ProductCarouselItem } from '@/components/home/ProductCarousel.jsx'
import { getErrorMessage } from '@/utils/apiError.js'

export function TrendingProductsSection() {
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    const controller = new AbortController()

    async function load() {
      setLoading(true)
      setError('')
      try {
        const payload = await fetchProducts(
          { trending: 'true', limit: '12', sort: 'rating' },
          { signal: controller.signal },
        )
        if (active) setProducts(payload.products ?? [])
      } catch (err) {
        if (!active || isCancelledRequest(err)) return
        setError(getErrorMessage(err, 'Unable to load trending products'))
      } finally {
        if (active) setLoading(false)
      }
    }

    load()
    return () => {
      active = false
      controller.abort()
    }
  }, [])

  return (
    <section className="tn-section-y">
      <div className="tn-container space-y-8">
        <SectionTitle
          eyebrow="Trending"
          title="What the community is buying"
          subtitle="Live trending flags from MongoDB — ideal for homepage carousels and campaign landings."
        />
        {error ? (
          <p className="rounded-tn-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-900 dark:text-amber-100">
            {error}
          </p>
        ) : null}
        {loading ? (
          <ProductGridSkeleton count={4} />
        ) : products.length === 0 && !error ? (
          <p className="rounded-tn-lg border border-zinc-200/80 bg-zinc-50/80 px-4 py-6 text-center text-sm text-zinc-600 dark:border-white/10 dark:bg-tn-900/50 dark:text-zinc-400">
            No trending products yet. Seed the catalog or mark items as trending in Admin → Products.
          </p>
        ) : (
          <ProductCarousel className="px-0.5">
            {products.map((product) => (
              <ProductCarouselItem key={product.id}>
                <ProductCard product={product} detailSlug={product.slug} />
              </ProductCarouselItem>
            ))}
          </ProductCarousel>
        )}
      </div>
    </section>
  )
}
