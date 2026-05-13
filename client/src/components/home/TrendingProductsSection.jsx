import { useEffect, useState } from 'react'
import { fetchProducts } from '@/services/productService.js'
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

    async function load() {
      setLoading(true)
      setError('')
      try {
        const payload = await fetchProducts({ trending: 'true', limit: '12', sort: 'rating' })
        if (active) setProducts(payload.products)
      } catch (err) {
        if (active) setError(getErrorMessage(err, 'Unable to load trending products'))
      } finally {
        if (active) setLoading(false)
      }
    }

    load()
    return () => {
      active = false
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
