import { useEffect, useState } from 'react'
import { trendingProducts } from '@/data/mockHomeFeed.js'
import { sleep } from '@/utils/sleep.js'
import { SectionTitle } from '@/components/ui/SectionTitle.jsx'
import { ProductCard } from '@/components/ui/ProductCard.jsx'
import { ProductGridSkeleton } from '@/components/ui/LoadingSkeleton.jsx'

export function TrendingProductsSection() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    ;(async () => {
      await sleep(650)
      if (active) setLoading(false)
    })()
    return () => {
      active = false
    }
  }, [])

  return (
    <section className="tn-section-y">
      <div className="tn-container">
        <SectionTitle
          eyebrow="Trending"
          title="Products shoppers love"
          subtitle="Mock catalog for layout — wire to your product API without changing the cards."
        />
        {loading ? (
          <ProductGridSkeleton count={4} />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {trendingProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
